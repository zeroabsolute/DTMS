import { Router } from 'express';

import * as SessionController from '../controllers/session';
import * as SessionValidator from '../validators/session';

const router = new Router();

router.route('/session').post(
  SessionValidator.openSessionValidator,
  SessionController.openSession,
);

export default router;