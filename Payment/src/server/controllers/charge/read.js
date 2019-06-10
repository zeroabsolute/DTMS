import models from '../../models/_index';
import logger from '../../logger';

/**
 * Read a charge by id.
 * 
 * @swagger
 *
 * paths:
 *  /charge/{id}:
 *    get:
 *      tags:
 *        - Charge
 *      summary: Get charge
 *      description: Reads details about a charge
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Charge Id
 *          required: true
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

export const getCharge = async (req, res) => {
  try {
    const result = await models.Charge.findByPk(req.params.id);

    res.status(200).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};