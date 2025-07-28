import { Router } from 'express';
import { getBalance } from './balance.controller.js';
import protect from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/', getBalance);

export default router;
