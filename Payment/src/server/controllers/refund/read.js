import models from '../../models/_index';
import logger from '../../logger';

/**
 * Read a refund by id.
 * 
 * @swagger
 *
 * paths:
 *  /refund/{id}:
 *    get:
 *      tags:
 *        - Refund
 *      summary: Get refund
 *      description: Reads details about a refund
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Refund Id
 *          required: true
 *      responses:
 *        200:
 *          description: Request processed successfully
 *          schema:
 *            allOf:
 *              - $ref: "#/definitions/Refund"
 *            properties:
 *              charge:
 *                $ref: "#/definitions/Charge"
 *        400:
 *          $ref: "#/responses/400"
 *        500:
 *          $ref: "#/responses/500"
 */

export const getRefund = async (req, res) => {
  try {
    const result = await models.Refund.findByPk(req.params.id, { include: [{ model: models.Charge }] });

    res.status(200).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};