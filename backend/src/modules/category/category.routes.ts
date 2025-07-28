import { Router } from 'express';
import { getCategories } from './category.controller.js';
import protect from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getCategories);

export default router;
