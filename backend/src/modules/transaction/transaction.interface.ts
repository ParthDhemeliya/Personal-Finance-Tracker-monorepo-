import { Types } from 'mongoose';

export interface ITransaction {
  _id?: string;
  type: 'income' | 'expense';
  amount: number;
  incomeSource?: Types.ObjectId | string;
  customIncomeSource?: string;
  expenseCategory?: Types.ObjectId | string;
  customExpenseCategory?: string;
  date: Date;
  description?: string;
  user: Types.ObjectId | string;
  paymentMethod: string;
  currency: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
