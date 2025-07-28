import z from 'zod';

export const ExpenseSchema = z
  .object({
    type: z.literal('expense'),
    amount: z.number().positive(),
    currency: z.string().length(3),
    paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'other']),
    categoryId: z.string().optional(),
    customCategory: z.string().optional(),
    date: z.string(),
    description: z.string().optional(),
  })
  .refine((data) => data.categoryId || data.customCategory, {
    message: 'Either categoryId or customCategory must be provided',
    path: ['categoryId'],
  });
