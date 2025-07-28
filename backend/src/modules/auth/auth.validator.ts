import { z } from 'zod';

export const SignupSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = SignupSchema.pick({
  email: true,
  password: true,
});
