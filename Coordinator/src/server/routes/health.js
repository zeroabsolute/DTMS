import { Router } from 'express';

const router = new Router();

router.route('/health').get(
  (req, res) => { res.sendStatus(200); }
);

export default router;