import { Router } from 'express';

import healthRouter from './health';
import sessionRouter from './session';
import statusRouter from './status';

const router = new Router();

router.use(healthRouter);
router.use(sessionRouter);
router.use(statusRouter);

export default router;
