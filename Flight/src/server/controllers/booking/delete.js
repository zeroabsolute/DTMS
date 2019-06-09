import Booking from '../../models/booking';
import logger from '../../logger';

/**
 * Delete a reservation.
 * 
 * @swagger
 *
 * paths:
 *  /booking/{id}:
 *    delete:
 *      tags:
 *        - Booking
 *      summary: Delete booking
 *      description: Deletes a reservation by Id
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

export const deleteBooking = async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};