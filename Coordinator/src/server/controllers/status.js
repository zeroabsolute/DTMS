import TransactionLog from '../models/transaction_log';
import logger from '../logger';

/**
 * Get transaction status (e.g. for polling)
 * 
 * @swagger
 *
 * paths:
 *  /status/{id}:
 *    get:
 *      tags:
 *        - Status
 *      summary: Get transaction status
 *      description: Returns the payload with the transaction status and output for each step, and the overall state.
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Transaction cuid
 *          required: true
 *      responses:
 *        200:
 *          description: Request processed successfully
 *          schema:
 *            $ref: "#/definitions/TransactionLog"
 *        404:
 *          description: No results found
 *        500:
 *          $ref: "#/responses/500"
 */

export const getTransactionStatus = async (req, res) => {
  try {
    const result = await TransactionLog.findOne({ transactionCuid: req.params.id });

    if (!result) {
      res.sendStatus(404);
    }

    res.status(200).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};
