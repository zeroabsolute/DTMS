import { Router } from 'express';

import healthRouter from './health';
import chargeRouter from './charge';
import refundRouter from './refund';

const router = new Router();

router.use(healthRouter);
router.use(chargeRouter);
router.use(refundRouter);

export default router;
