import type { PaymentMethod } from "./commonTypes";

interface BaseTransaction {
  _id: string;
  amount: number;
  date: string;
  description?: string;
  paymentMethod: PaymentMethod;
  currency?: string;
}

// Specific for income
export interface IncomeEntry extends BaseTransaction {
  type: "income";
  incomeSource: string | { _id: string; name: string; color: string } | null;
  customIncomeSource?: string | null;
}

export interface ExpenseEntry extends BaseTransaction {
  type: "expense";
  expenseCategory?:
    | string
    | { _id: string; name: string; color: string }
    | null;
  customExpenseCategory?: string | null;
}

// Unified type
export type TransactionEntry = IncomeEntry | ExpenseEntry;

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Add any other user fields you expect from your API
}

export interface Balance {
  amount: number;
  percentChange: number;
}

export interface Stats {
  income: number;
  expense: number;
  // Add any other stats fields you expect from your API
}
