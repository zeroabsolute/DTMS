import { Router } from 'express';

import ChargeController from '../controllers/charge/_index';
import * as ChargeValidator from '../validators/charge';

const router = new Router();

/** Create handlers */

router.route('/charge').post(
  ChargeValidator.postChargeValidator,
  ChargeController.create.addCharge,
);

/** Read handlers */

router.route('/charge/:id').get(
  ChargeController.read.getCharge,
);

export default router;