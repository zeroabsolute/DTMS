import models from '../../models/_index';
import logger from '../../logger';

/**
 * Handles checkout (Creates a charge).
 * 
 * @swagger
 *
 * paths:
 *  /charge:
 *    post:
 *      tags:
 *        - Charge
 *      summary: Post charge
 *      description: Charges the required amount of money
 *      parameters:
 *        - name: body
 *          in: body
 *          description: Charge body parameters
 *          schema:
 *            required:
 *              - amount
 *              - currency
 *              - source
 *            properties:
 *              amount:
 *                type: number
 *              currency:
 *                type: string
 *              description:
 *                type: string
 *              source:
 *                type: string
 *              metadata:
 *                type: object
 *      responses:
 *        200:
 *          description: Request processed successfully
 *          schema: 
 *            $ref: "#/definitions/Charge"
 *        400:
 *          $ref: "#/responses/400"
 *        500:
 *          $ref: "#/responses/500"
 */

export const addCharge = async (req, res) => {
  try {
    const body = {
      amount: req.body.amount,
      currency: req.body.currency,
      source: req.body.source,
      description: req.body.description,
      metadata: req.body.metadata ? JSON.stringify(req.body.metadata) : null,
    };

    const result = await models.Charge.create(body);

    res.status(201).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};