import request from 'request-promise';

import TransactionLog from '../models/transaction_log';
import * as states from '../constants/states';
import { createJob } from '../controllers/producer';
import loggerService from '../logger';

/**
 * Helper function (1)
 * 
 * Extracts transaction/session id from job name.
 */

export function getTransactionId(name) {
  return name.split('-').pop();

}

/**
 * Helper function (2)
 * 
 * Differentiates transactions and compensations.
 */

export function isTransaction(name) {
  return !name.includes('compensation');
}

/**
 * Helper function (3)
 * 
 * Prepares the request body for job execution.
 * Params can come directly from the request (in operation.params),
 * or from the results of previously executed jobs (defined in operation.dependencies).
 */

export async function prepareParams(name, input) {
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
      const data = output.find((element) => element.index === item.fromStep).result;

      if (data) {
        dependencyParams[item.paramType][item.outputParamKey] = data[item.inputParamKey];
      }
    });
  }

  const params = {
    body: {
      ...inputParams,
      ...dependencyParams.body,
    },
    path: dependencyParams.path,
    query: dependencyParams.query,
  };

  return params;
}

/**
 * Helper function (4)
 * 
 * Executes the request based on the generated params.
 */

export async function executeRequest(method, uri, params) {
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

export async function updateLogItem(transactionId, status, output, index) {
  const query = { transactionCuid: transactionId };
  const log = await TransactionLog.findOne(query);

  if (!log) {
    throw new Error('Log not found');
  }

  // Update output for the transaction step
  const newOutput = [];

  log.output.forEach((item) => {
    if (item.index === index && output) {
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

/**
 * Helper function (6)
 * 
 * Updates overall log status.
 */

export async function updateOverallLogStatus(transactionId, newStatus, lastAction) {
  const query = { transactionCuid: transactionId };
  const update = { overallStatus: newStatus };

  if (lastAction) {
    update.lastAction = lastAction;
  }

  await TransactionLog.findOneAndUpdate(query, update);
}

/**
 * Helper function (7)
 * 
 * Generates compensation jobs after compensation has been triggered.
 */

export async function generateCompensationJobs(transactionId) {
  console.log('\n\n\nStarting compensation ...\n\n');

  // Get the current status from the transaction log
  const query = { transactionCuid: transactionId };
  const log = await TransactionLog.findOne(query);

  if (!log) {
    throw new Error('Log not found');
  }

  const status = log.status;
  const input = log.input.transaction;

  // Find the step which failed
  const failedStepIndex = status.find((item) => item.state === states.transactionStepState.TRANSACTION_FAILED).index;

  // Create compensation jobs for the succeeded steps before "failedStepIndex"
  const jobId = `transaction-compensation-${transactionId}`;
  const attemptsPerCompensationJob = 3;

  for (let i = 0; i < input.length; i += 1) {
    if (input[i].index === failedStepIndex) {
      break;
    }

    const priority = input[i].index;

    createJob(jobId, { ...input[i].toJSON(), steps: i + 1 }, priority, attemptsPerCompensationJob);
  }
}

/**
 * Helper function (8)
 * 
 * Calls the callbackUrl and posts the transaction results.
 */

export async function postTransactionResults(transactionId) {
  try {
    const query = { transactionCuid: transactionId };
    const log = await TransactionLog.findOne(query);
    const options = {
      method: 'POST',
      uri: log.input.callbackUrl,
      json: true,
      body: log,
    };

    await request(options);
  } catch (e) {
    loggerService.getLogger().error(e);
  }
}