import { Router } from 'express';

import healthRouter from './health';

const router = new Router();

router.use(healthRouter);

export default router;
