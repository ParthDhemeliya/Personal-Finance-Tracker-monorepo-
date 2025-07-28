import { Router } from 'express';
import { getRecentTransactions } from './transaction.controller.js';
import protect from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/recent', getRecentTransactions);

export default router;
