import * as BudgetRepo from './budget.repository.js';
import { IBudget } from './budget.interface.js';

export const getBudgets = async (userId: string) => {
  return BudgetRepo.findBudgetsByUser(userId);
};

export const createBudget = async (budget: IBudget) => {
  return BudgetRepo.createBudget(budget);
};

export const updateBudget = async (
  id: string,
  userId: string,
  data: Partial<IBudget>,
) => {
  return BudgetRepo.updateBudget(id, userId, data);
};

export const deleteBudget = async (id: string, userId: string) => {
  return BudgetRepo.deleteBudget(id, userId);
};
