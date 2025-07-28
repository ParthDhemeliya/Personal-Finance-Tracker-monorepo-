import * as TransactionRepo from './transaction.repository.js';

export const getRecentTransactions = async (userId: string, limit: number) => {
  return TransactionRepo.findRecentTransactions(userId, limit);
};

// Add more service methods as needed (create, update, delete, etc.)
