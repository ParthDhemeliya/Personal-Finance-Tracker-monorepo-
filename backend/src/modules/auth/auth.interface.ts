import { z } from 'zod';
import { SignupSchema, LoginSchema } from './auth.validator.js';

export interface AuthPayload {
  id: string;
}

export type SignupRequestBody = z.infer<typeof SignupSchema>;
export type AuthRequestBody = z.infer<typeof LoginSchema>;
