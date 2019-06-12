import models from '../../models/_index';
import logger from '../../logger';

/**
 * Handles refunds if a charge fails.
 * 
 * @swagger
 *
 * paths:
 *  /refund:
 *    post:
 *      tags:
 *        - Refund
 *      summary: Post refund
 *      description: Refunds a given charge
 *      parameters:
 *        - name: body
 *          in: body
 *          description: Refund body parameters
 *          schema:
 *            required:
 *              - chargeId
 *              - amount
 *            properties:
 *              amount:
 *                type: number
 *              chargeId:
 *                type: number
 *              description:
 *                type: string
 *              metadata:
 *                type: object
 *      responses:
 *        200:
 *          description: Request processed successfully
 *          schema: 
 *            $ref: "#/definitions/Refund"
 *        204:
 *          description: Request processed successfully
 *        400:
 *          $ref: "#/responses/400"
 *        500:
 *          $ref: "#/responses/500"
 */

export const addRefund = async (req, res) => {
  try {
    const body = {
      amount: req.body.amount,
      chargeId: req.body.chargeId,
      description: req.body.description,
      metadata: req.body.metadata ? JSON.stringify(req.body.metadata) : "",
    };

    const existingRefunds = await models.Refund.findOne({ where: { chargeId: req.body.chargeId } });
    
    if (existingRefunds) {
      res.sendStatus(204);

      return;
    }

    const result = await models.Refund.create(body);

    res.status(201).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};