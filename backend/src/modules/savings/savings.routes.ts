import { Router } from 'express';
import {
  getSavingsGoal,
  createSavingsGoal,
  updateSavingsGoal,
  getCurrentSavingsController,
} from './savings.controller.js';
import protect from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/', getSavingsGoal);
router.post('/', createSavingsGoal);
router.put('/', updateSavingsGoal);
router.get('/current', getCurrentSavingsController);

export default router;
