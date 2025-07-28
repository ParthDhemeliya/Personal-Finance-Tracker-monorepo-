import * as BalanceRepo from './balance.repository.js';

export const getBalanceSummary = async (userId: string) => {
  const [totalIncome, totalExpense] = await Promise.all([
    BalanceRepo.getTotalIncome(userId),
    BalanceRepo.getTotalExpense(userId),
  ]);
  return {
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
  };
};
