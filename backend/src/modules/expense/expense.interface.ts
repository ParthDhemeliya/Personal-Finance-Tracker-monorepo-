export interface ExpenseCategorySummary {
  category: string;
  amount: number;
}
import { Types } from 'mongoose';
import { z } from 'zod';
import { ExpenseSchema } from './expense.validator.js';

// export type ExpenseInput = z.infer<typeof ExpenseSchema> & {
//   expenseCategory: Types.ObjectId;
//   user: Types.ObjectId | string;
//   type?: string;
// };
export type ExpenseInput = z.infer<typeof ExpenseSchema> & {
  user: Types.ObjectId | string;
};
