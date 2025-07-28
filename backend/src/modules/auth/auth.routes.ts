import { Router } from 'express';
import {
  signup,
  login,
  getUser,
  deleteUser,
  logout,
} from './auth.controller.js';
import protect from './auth.middleware.js';
import { validate } from '../../utils/validate.js';
import { LoginSchema, SignupSchema } from './auth.validator.js';

const router = Router();

router.post('/signup', validate(SignupSchema), signup);
router.post('/login', validate(LoginSchema), login);
router.post('/logout', logout);
router.get('/user', protect, getUser);
router.delete('/user', protect, deleteUser);

export default router;
