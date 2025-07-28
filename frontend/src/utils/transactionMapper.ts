import type { IncomeEntry } from "../types/Interface";
import type { ITransaction } from "../types/Transaction";
import type { ExpenseEntry } from "../types/Interface";

export function mapIncomeEntryToTransaction(entry: IncomeEntry): ITransaction {
  return {
    _id: entry._id,
    amount: entry.amount,
    date: entry.date,
    description: entry.description,
    paymentMethod: entry.paymentMethod,
    type: "income",
    // Only set incomeSource and customIncomeSource, not category
    incomeSource:
      typeof entry.incomeSource === "object" && entry.incomeSource !== null
        ? entry.incomeSource._id
        : entry.incomeSource || undefined,
    customIncomeSource: entry.customIncomeSource || undefined,
    currency: entry.currency || "USD",
  };
}

export function mapITransactionToIncomeEntry(tx: ITransaction): IncomeEntry {
  let incomeSource: IncomeEntry["incomeSource"] = null;
  if (
    typeof tx.incomeSource === "string" ||
    tx.incomeSource === null ||
    tx.incomeSource === undefined
  ) {
    incomeSource = tx.incomeSource ?? null;
  } else {
    // Add a default color if missing
    incomeSource = {
      ...tx.incomeSource,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: (tx.incomeSource as any).color ?? "#cccccc",
    };
  }
  return {
    _id: tx._id,
    type: "income",
    amount: tx.amount,
    date: tx.date,
    description: tx.description,
    paymentMethod: tx.paymentMethod,
    currency: tx.currency,
    incomeSource,
    customIncomeSource: tx.customIncomeSource ?? null,
  };
}

export function mapITransactionToExpenseEntry(tx: ITransaction): ExpenseEntry {
  let expenseCategory: ExpenseEntry["expenseCategory"] = null;
  if (
    typeof tx.expenseCategory === "string" ||
    tx.expenseCategory === null ||
    tx.expenseCategory === undefined
  ) {
    expenseCategory = tx.expenseCategory ?? null;
  } else {
    expenseCategory = {
      ...tx.expenseCategory,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: (tx.expenseCategory as any).color ?? "#cccccc",
    };
  }
  return {
    _id: tx._id,
    type: "expense",
    amount: tx.amount,
    date: tx.date,
    description: tx.description,
    paymentMethod: tx.paymentMethod,
    currency: tx.currency,
    expenseCategory,
    customExpenseCategory: tx.customExpenseCategory ?? null,
  };
}
