import { ExpenseInput } from './expense.interface.js';
import { ExpenseRepository } from './expense.repository.js';
import { AppError } from '../../utils/error/AppError.js';
import { Types } from 'mongoose';
import Transaction from '../../../models/Transaction.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAmount(expense: any) {
  const obj = expense.toObject();
  return {
    ...obj,
    amount: parseFloat(expense.amount.toString()),
  };
}

export const ExpenseService = {
  createExpense: async (data: ExpenseInput, userId: string) => {
    const created = await ExpenseRepository.create({ ...data, user: userId });
    return normalizeAmount(created);
  },

  getAllExpenses: async (userId: string) => {
    const expenses = await ExpenseRepository.findAllByUser(userId);
    return expenses.map(normalizeAmount);
  },

  updateExpense: async (
    id: string,
    data: Partial<ExpenseInput>,
    userId: string,
  ) => {
    const updated = await ExpenseRepository.updateByUser(id, data, userId);
    if (!updated) throw new AppError('Expense not found', 404);
    return normalizeAmount(updated);
  },

  deleteExpense: async (id: string, userId: string) => {
    const deleted = await ExpenseRepository.softDeleteByUser(id, userId);
    if (!deleted) throw new AppError('Expense not found', 404);
    return deleted;
  },
  getPaginatedExpenses: async (page: number, limit: number, userId: string) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ExpenseRepository.findPaginatedByUser(userId, skip, limit),
      ExpenseRepository.countByUser(userId),
    ]);

    return {
      data: data.map(normalizeAmount),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },

  calculateTotalAmount: async (userId: string) => {
    const result = await Transaction.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
          isDeleted: false,
          type: 'expense',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Convert Decimal128 to number safely
    const rawTotal = result[0]?.total;
    const total = rawTotal ? parseFloat(rawTotal.toString()) : 0;

    return { total };
  },
};
