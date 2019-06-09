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
 *      - dateCreated
 *      - userId
 *      - hotelId
 *      - roomId
 *      - datetime
 *    properties:
 *      _id:
 *        type: string
 *      dateCreated:
 *        type: string
 *      userId:
 *        type: string
 *      hotelId:
 *        type: string
 *      roomId:
 *        type: string
 *      datetime:
 *        type: string
 */

const bookingSchema = new Schema({
  dateCreated: { type: 'Date', default: Date.now, required: true },
  datetime: { type: 'Date', required: true },
  userId: { type: 'String', required: true },
  hotelId: { type: 'String', required: true },
  roomId: { type: 'String', required: true },
});

export default mongoose.model('booking', bookingSchema);