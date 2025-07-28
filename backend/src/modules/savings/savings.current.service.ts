import Transaction from '../../../models/Transaction.js';
import mongoose from 'mongoose';

export const getCurrentSavings = async (userId: string) => {
  // Sum of all income - sum of all expense for this user
  const [incomeAgg, expenseAgg] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: 'income',
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);
  const totalIncome = incomeAgg.length > 0 ? Number(incomeAgg[0].total) : 0;
  const totalExpense = expenseAgg.length > 0 ? Number(expenseAgg[0].total) : 0;
  return totalIncome - totalExpense;
};
