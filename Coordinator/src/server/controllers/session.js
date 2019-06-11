import cuid from 'cuid';

import TransactionLog from '../models/transaction_log';
import states from '../constants/states';
import logger from '../logger';

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
    });

    await transactionLog.save();

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
    state: states.PENDING,
  }));
}