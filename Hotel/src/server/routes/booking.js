import { Router } from 'express';

import BookingController from '../controllers/booking/_index';
import * as BookingValidator from '../validators/booking';

const router = new Router();

/** Create handlers */

router.route('/booking').post(
  BookingValidator.postBookingValidator,
  BookingController.create.addBooking,
);

/** Read handlers */

router.route('/booking/:id').get(
  BookingController.read.getBooking,
);

/** Delete handlers */

router.route('/booking/:id').delete(
  BookingController.delete.deleteBooking,
);

export default router;