import { Types } from 'mongoose';

export interface IncomeInputRaw {
  amount: number;
  date: string;
  description?: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
  currency: string;
  incomeSource?: string | null;
  customIncomeSource?: string | null;
}

export interface IncomeInput
  extends Omit<IncomeInputRaw, 'incomeSource' | 'customIncomeSource'> {
  incomeSource?: Types.ObjectId;
  customIncomeSource?: string;
  user: Types.ObjectId;
  type?: 'income';
}
