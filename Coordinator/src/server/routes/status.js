import { Router } from 'express';

import * as StatusController from '../controllers/status';

const router = new Router();

router.route('/status/:id').get(
  StatusController.getTransactionStatus,
);

export default router;