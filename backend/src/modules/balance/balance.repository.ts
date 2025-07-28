import Transaction from '../../../models/Transaction.js';
import mongoose from 'mongoose';

export const getTotalIncome = async (userId: string) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: 'income',
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result.length > 0 ? Number(result[0].total) : 0;
};

export const getTotalExpense = async (userId: string) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return result.length > 0 ? Number(result[0].total) : 0;
};
