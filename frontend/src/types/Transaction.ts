export type TransactionType = "income" | "expense";

// export interface ITransaction {
//   _id: string;
//   type: "income" | "expense";
//   amount: number;
//   customIncomeSource: string;
//   date: string;
//   description?: string;
//   paymentMethod: "cash" | "card" | "bank_transfer" | "other";
//   currency?: string;
//   user?: string;
// }

export interface ITransaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  description?: string;
  paymentMethod: "cash" | "card" | "bank_transfer" | "other";
  currency: string;

  // Optional fields for income
  incomeSource?: string | { _id: string; name: string };
  customIncomeSource?: string;

  // Optional fields for expense
  expenseCategory?: string | { _id: string; name: string };
  customExpenseCategory?: string;

  // Backend fields
  createdAt?: string;
  updatedAt?: string;
}
