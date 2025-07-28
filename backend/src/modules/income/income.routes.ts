import express from 'express';
import {
  createIncome,
  deleteIncome,
  getAllIncomes,
  getPaginatedIncomes,
  getTotalIncome,
  updateIncome,
} from './income.controller.js';
import { validateIncome } from './income.validator.middleware.js';
import validateObjectId from '../../utils/validateObjectId.js';
import protect from '../auth/auth.middleware.js';
import authMiddleware from '../auth/auth.middleware.js';
import { getIncomeStats } from './income.stats.controller.js';
import { getIncomeSources } from './income.sources.controller.js';

const router = express.Router();

router.use(protect);
router.get('/paginated', authMiddleware, getPaginatedIncomes);

router.get('/total', getTotalIncome);
router.get('/stats', getIncomeStats);
router.get('/sources', getIncomeSources);

// other routes
router.post('/', validateIncome, createIncome);
router.get('/', getAllIncomes);
router.put('/:id', validateObjectId, validateIncome, updateIncome);
router.delete('/:id', validateObjectId, deleteIncome);

export default router;
