import { z } from 'zod';

export const savingsGoalSchema = z.object({
  amount: z.number().min(0),
  targetDate: z.coerce.date(),
});
