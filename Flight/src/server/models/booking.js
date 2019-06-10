import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @swagger
 *
 * definitions:
 *  Booking:
 *    type: object
 *    required:
 *      - _id
 *      - createdAt
 *      - userId
 *      - planeId
 *      - places
 *      - datetime
 *    properties:
 *      _id:
 *        type: string
 *      createdAt:
 *        type: string
 *      userId:
 *        type: string
 *      planeId:
 *        type: string
 *      places:
 *        type: number
 *      datetime:
 *        type: string
 */

const bookingSchema = new Schema({
  createdAt: { type: 'Date', default: Date.now, required: true },
  datetime: { type: 'Date', required: true },
  userId: { type: 'String', required: true },
  planeId: { type: 'String', required: true },
  places: { type: 'Number', required: true },
});

export default mongoose.model('booking', bookingSchema);