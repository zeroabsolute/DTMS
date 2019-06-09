import Booking from '../../models/booking';
import logger from '../../logger';

/**
 * Books plane seats.
 * 
 * @swagger
 *
 * paths:
 *  /booking:
 *    post:
 *      tags:
 *        - Booking
 *      summary: Post booking
 *      description: Reserves seats for the flight
 *      parameters:
 *        - name: body
 *          in: body
 *          description: Booking body parameters
 *          schema:
 *            required:
 *              - userId
 *              - planeId
 *              - places
 *              - datetime
 *            properties:
 *              userId:
 *                type: string
 *              planeId:
 *                type: string
 *              places:
 *                type: number
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
      planeId: req.body.planeId,
      places: req.body.places,
      datetime: req.body.datetime,
    });

    const result = await body.save();

    res.status(201).json(result);
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};