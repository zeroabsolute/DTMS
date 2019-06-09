import { Router } from 'express';

import healthRouter from './health';
import bookingRouter from './booking';

const router = new Router();

router.use(healthRouter);
router.use(bookingRouter);

export default router;
