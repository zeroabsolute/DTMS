import Booking from '../../models/booking';
import logger from '../../logger';

/**
 * Books a room in a hotel.
 * 
 * @swagger
 *
 * paths:
 *  /booking:
 *    post:
 *      tags:
 *        - Booking
 *      summary: Post booking
 *      description: Reserves a room in a hotel
 *      parameters:
 *        - name: body
 *          in: body
 *          description: Booking body parameters
 *          schema:
 *            required:
 *              - userId
 *              - hotelId
 *              - roomId
 *              - datetime
 *            properties:
 *              userId:
 *                type: string
 *              hotelId:
 *                type: string
 *              roomId:
 *                type: string
 *              datetime:
 *                type: string
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

export const addBooking = async (req, res) => {
  try {
    const body = new Booking({
      userId: req.body.userId,
      hotelId: req.body.hotelId,
      roomId: req.body.roomId,
      datetime: req.body.datetime,
    });

    const result = await body.save();

    res.status(201).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};