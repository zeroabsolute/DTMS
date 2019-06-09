import Booking from '../../models/booking';
import logger from '../../logger';

/**
 * Read a reservation by id.
 * 
 * @swagger
 *
 * paths:
 *  /booking/{id}:
 *    get:
 *      tags:
 *        - Booking
 *      summary: Get booking
 *      description: Reads details about a room reservation
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Booking Id
 *          required: true
 *      responses:
 *        200:
 *          description: Request processed successfully
 *          schema: 
 *            $ref: "#/definitions/Booking"
 *        400:
 *          $ref: "#/responses/400"
 *        500:
 *          $ref: "#/responses/500"
 */

export const getBooking = async (req, res) => {
  try {
    const result = await Booking.findById(req.params.id);

    res.status(200).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};