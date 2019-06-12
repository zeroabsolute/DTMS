import logger from '../logger';
import * as states from '../constants/states';
import { getQueue } from './producer';
import * as helpers from '../helpers/transaction_execution';

const startConsumer = (name) => {
  const queue = getQueue();

  queue.process(name, async (job, done) => {
    if (helpers.isTransaction(name)) {
      await executeTransactionStep(name, job.data, done);
    } else {
      await executeCompensationStep(name, job.data, done);
    }
  });
};

export default startConsumer;


/**************************************************************************************/
/**************************************************************************************/
/* TRANSACTION JOB LOGIC (FORWARD & COMPENSATION)                                     */
/**************************************************************************************/
/**************************************************************************************/


/**
 * Transaction execution logic.
 */

async function executeTransactionStep(name, input, done) {
  const transactionId = helpers.getTransactionId(name);

  try {
    await helpers.updateLogItem(transactionId, states.transactionStepState.TRANSACTION_STARTED, undefined, input.index);

    const params = await helpers.prepareParams(name, input.operation);
    const result = await helpers.executeRequest(input.operation.method, input.operation.url, params);
    
    await helpers.updateLogItem(transactionId, states.transactionStepState.TRANSACTION_SUCCEEDED, result, input.index);

    // If this is the last job => update overall transaction status
    if (input.index === input.steps) {
      await helpers.updateOverallLogStatus(transactionId, states.transactionState.FINISHED, states.actions.TRANSACTION);
    }

    done();
  } catch (e) {
    done();

    await helpers.updateLogItem(transactionId, states.transactionStepState.TRANSACTION_FAILED, undefined, input.index);

    // Some error happened => start compensation
    const jobId = `transaction-compensation-${transactionId}`;

    await helpers.generateCompensationJobs(transactionId);
    startConsumer(jobId);
  }
}

/**
 * Compensation execution logic.
 */

async function executeCompensationStep(name, input, done) {
  const transactionId = helpers.getTransactionId(name);

  try {
    await helpers.updateLogItem(transactionId, states.transactionStepState.COMPENSATION_STARTED, undefined, input.index);

    const params = await helpers.prepareParams(name, input.compensation);
    
    await helpers.executeRequest(input.compensation.method, input.compensation.url, params);
    await helpers.updateLogItem(transactionId, states.transactionStepState.COMPENSATION_SUCCEEDED, {}, input.index);

    // If this is the last job => update overall transaction status
    if (input.index === input.steps) {
      await helpers.updateOverallLogStatus(transactionId, states.transactionState.FINISHED, states.actions.COMPENSATION);
    }

    done();
  } catch (e) {
    done();

    await helpers.updateLogItem(transactionId, states.transactionStepState.COMPENSATION_FAILED, undefined, input.index);

    // Some error happened during compensation and all attemps failed => log the event and break
    await helpers.updateOverallLogStatus(transactionId, states.transactionState.FAILED, states.actions.COMPENSATION);
  }
}

