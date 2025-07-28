import { z } from 'zod';

export const budgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number().min(0),
  period: z.enum(['month', 'year']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
