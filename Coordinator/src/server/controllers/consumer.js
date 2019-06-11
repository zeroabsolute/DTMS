import logger from '../logger';
import { getQueue } from './producer';
import TransactionLog from '../models/transaction_log';

export default (name) => {
  const queue = getQueue();

  queue.process(name, async (job, done) => {
    if (isTransaction(name)) {
      await executeTransactionStep(name, job.data.operation);
      done();
    } else {
      await executeCompensationStep(name, job.data.compensation);
      done();
    }

    done();
  });
};

/**
 * Differentiate transactions and compensations.
 */

function isTransaction(name) {
  return !name.includes('compensation');
}

/**
 * Transaction execution logic.
 */

async function executeTransactionStep(name, input) {
  try {
    const params = await prepareParams(name, input);
    
  } catch (e) {
    throw e;
  }
}

/**
 * Compensation execution logic.
 */

async function executeCompensationStep() {

}

/**
 * Helper function (1)
 * 
 * Purpose: Extract transaction/session id from job name.
 */

function getTransactionId(name) {
  return name.split('-').pop();

}

/**
 * Helper function (2)
 * 
 * Purpose: Prepare the request body for job execution.
 *          Params can come directly from the request (in operation.params),
 *          or from the results of previously executed jobs (defined in operation.dependencies).
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
      const indexToCheck = item.fromStep - 1;
      const data = output[indexToCheck];
      
      if (data) {
        dependencyParams[item.paramType][item.outputParamKey] = data[item.inputParamKey];
      }
    });
  }

  const postBody = {
    ...inputParams,
    ...dependencyParams,
  };

  return postBody;
}