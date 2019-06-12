import cuid from 'cuid';

import TransactionLog from '../models/transaction_log';
import * as states from '../constants/states';
import logger from '../logger';
import { createJob } from './producer';
import startConsumer from './consumer';

/**
 * Open a transaction session.
 * 
 * @swagger
 *
 * paths:
 *  /session:
 *    post:
 *      tags:
 *        - Session
 *      summary: Start transaction
 *      description: Opens a transaction session and returns a transaction id.
 *      parameters:
 *        - name: body
 *          in: body
 *          description: Transaction body parameters
 *          schema:
 *            required:
 *              - transaction
 *              - callbackUrl
 *            properties:
 *              callbackUrl:
 *                type: string
 *              transaction:
 *                $ref: "#/definitions/TransactionInput"
 *      responses:
 *        200:
 *          description: Request processed successfully
 *          schema:
 *            properties:
 *              sessionId:
 *                type: string
 *        400:
 *          $ref: "#/responses/400"
 *        500:
 *          $ref: "#/responses/500"
 */

export const openSession = async (req, res) => {
  try {
    const sessionId = cuid();
    const input = req.body;
    const output = initLogOutput(req.body.transaction);
    const status = initLogStatus(req.body.transaction);

    const transactionLog = new TransactionLog({
      transactionCuid: sessionId,
      input,
      output,
      status,
      overallStatus: states.transactionState.PENDING,
    });

    // Create log entry
    await transactionLog.save();

    // Produce jobs and trigger consumer
    const jobId = `transaction-${sessionId}`;

    await generateJobs(jobId, input.transaction, sessionId);
    startConsumer(jobId);

    res.status(200).json({
      sessionId,
    });
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};

/**
 * Helper to initialize log output
 */

function initLogOutput(input) {
  return input.map((item) => ({
    index: item.index,
    result: {},
  }));
}

/**
 * Helper to initialize log status
 */

function initLogStatus(input) {
  return input.map((item) => ({
    index: item.index,
    state: states.transactionStepState.PENDING,
  }));
}

/**
 * Helper to generate jobs for transaction steps.
 */

async function generateJobs(jobId, transactionSteps = [], sessionId) {
  // Job generation
  transactionSteps.forEach((item) => {
    const priority = item.index;

    createJob(jobId, item, priority);
  });

  // Transaction log update -> set status 'started'
  const query = { transactionCuid: sessionId };
  const update = { overallStatus: states.transactionState.ONGOING };

  await TransactionLog.findOneAndUpdate(query, update);
}