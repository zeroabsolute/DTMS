import { Router } from 'express';

import RefundController from '../controllers/refund/_index';
import * as RefundValidator from '../validators/refund';

const router = new Router();

/** Create handlers */

router.route('/refund').post(
  RefundValidator.postRefundValidator,
  RefundController.create.addRefund,
);

/** Read handlers */

router.route('/refund/:id').get(
  RefundController.read.getRefund,
);

export default router;