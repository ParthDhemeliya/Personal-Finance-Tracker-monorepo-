import Transaction from '../../../models/Transaction.js';

export const findRecentTransactions = async (userId: string, limit: number) => {
  return Transaction.find({ user: userId, isDeleted: false })
    .sort({ date: -1, createdAt: -1 })
    .limit(limit);
};
