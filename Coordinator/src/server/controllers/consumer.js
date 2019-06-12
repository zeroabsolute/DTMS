import request from 'request-promise';

import logger from '../logger';
import * as states from '../constants/states';
import { getQueue } from './producer';
import TransactionLog from '../models/transaction_log';

export default (name) => {
  const queue = getQueue();

  queue.process(name, async (job, done) => {
    if (isTransaction(name)) {
      await executeTransactionStep(name, job.data, done);
    } else {
      await executeCompensationStep(name, job.data, done);
    }
  });
};


/**************************************************************************************/
/**************************************************************************************/
/* TRANSACTION JOB LOGIC (FORWARD & COMPENSATION)                                     */
/**************************************************************************************/
/**************************************************************************************/


/**
 * Transaction execution logic.
 */

async function executeTransactionStep(name, input, done) {
  const transactionId = getTransactionId(name);

  try {
    await updateLogItem(transactionId, states.transactionStepState.STARTED, undefined, input.index);

    const params = await prepareParams(name, input.operation);
    const result = await executeRequest(input.operation.method, input.operation.url, params);
    
    await updateLogItem(transactionId, states.transactionStepState.SUCCEEDED, result, input.index);

    done();
  } catch (e) {
    done();

    await updateLogItem(transactionId, states.transactionStepState.FAILED, undefined, input.index);

    // Some error happened => start compensation
    generateCompensationJobs();
  }
}

/**
 * Compensation execution logic.
 */

function generateCompensationJobs() {
  console.log('\n\nStarting compensation ...');
}

async function executeCompensationStep() {
}


/**************************************************************************************/
/**************************************************************************************/
/* HELPER FUNCTIONS                                                                   */
/**************************************************************************************/
/**************************************************************************************/


/**
 * Helper function (1)
 * 
 * Extracts transaction/session id from job name.
 */

function getTransactionId(name) {
  return name.split('-').pop();

}

/**
 * Helper function (2)
 * 
 * Differentiates transactions and compensations.
 */

function isTransaction(name) {
  return !name.includes('compensation');
}

/**
 * Helper function (3)
 * 
 * Prepares the request body for job execution.
 * Params can come directly from the request (in operation.params),
 * or from the results of previously executed jobs (defined in operation.dependencies).
 */

async function prepareParams(name, input) {
  const inputParams = input.params;
  const transactionId = getTransactionId(name);
  const hasDependencies = input.dependencies && input.dependencies.length;
  const dependencyParams = {
    body: {},
    path: {},
    query: {},
  };

  // Get params from dependencies (if there are dependencies)
  if (hasDependencies) {
    const log = await TransactionLog.findOne({ transactionCuid: transactionId });

    if (!log) {
      throw new Error('Log not found');
    }

    const output = log.output;
    
    input.dependencies.forEach((item) => {
      const data = output.find((element) => element.index === item.fromStep);
      
      if (data) {
        dependencyParams[item.paramType][item.outputParamKey] = data[item.inputParamKey];
      }
    });
  }

  const postBody = {
    body: {
      ...inputParams,
      ...dependencyParams.body,
    },
    path: dependencyParams.path,
    query: dependencyParams.query,
  };

  return postBody;
}

/**
 * Helper function (4)
 * 
 * Executes the request based on the generated params.
 */

async function executeRequest(method, uri, params) {
  let finalUrl = uri;

  // Add path params in url, if necessary
  if (params.path && Object.keys(params.path).length) {
    const pathParams = Object.values(params.path).join('/');

    finalUrl = `${finalUrl}/${pathParams}`;
  }

  // Add query params if necessary
  if (params.query && Object.keys(params.query).length) {
    finalUrl = `${finalUrl}?`;

    Object.keys(params.query).forEach((key) => {
      finalUrl = `${finalUrl}key=${params.query[key]}`;  
    });
  }

  // Construct request options
  const options = {
    method,
    uri: finalUrl,
  };

  // Add body params if necessary
  if (params.body && Object.keys(params.body).length) {
    options.json = true;
    options.body = params.body;
  }
  
  const result = await request(options);

  return result;
}

/**
 * Helper function (5)
 * 
 * Updates log for one of the jobs/steps of the whole transaction.
 */

async function updateLogItem(transactionId, status, output, index) {
  const query = { transactionCuid: transactionId };
  const log = await TransactionLog.findOne(query);

  if (!log) {
    throw new Error('Log not found');
  }

  // Update output for the transaction step
  const newOutput = [];

  log.output.forEach((item) => {
    if (item.index === index) {
      newOutput.push({
        ...item.toJSON(),
        result: output,
      });
    } else {
      newOutput.push(item);
    }
  });

  // Update status for the transaction step
  const newStatus = [];

  log.status.forEach((item) => {
    if (item.index === index) {
      newStatus.push({
        ...item.toJSON(),
        state: status,
      });
    } else {
      newStatus.push(item);
    }
  });

  // Execute the update
  const update = {
    ...log.toJSON(),
    status: newStatus,
    output: newOutput,
  };

  await TransactionLog.findOneAndUpdate(query, update);
}