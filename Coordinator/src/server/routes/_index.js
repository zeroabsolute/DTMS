import { Router } from 'express';

import healthRouter from './health';
import sessionRouter from './session';

const router = new Router();

router.use(healthRouter);
router.use(sessionRouter);

export default router;
