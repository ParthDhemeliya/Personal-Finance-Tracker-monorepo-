import { Router } from 'express';
import protect from '../auth/auth.middleware.js';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from './budget.controller.js';
import { getBudgetOverview } from './budget.overview.controller.js';

const router = Router();

router.use(protect);

router.get('/', getBudgets);
router.get('/overview', getBudgetOverview);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
