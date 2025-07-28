// Adjust the import path if necessary, or create the Budget model if it doesn't exist
import Budget from '../../../models/Budget.js';
import { IBudget } from './budget.interface.js';

export const findBudgetsByUser = async (userId: string) => {
  return Budget.find({ user: userId });
};

export const createBudget = async (budget: IBudget) => {
  return Budget.create(budget);
};

export const updateBudget = async (
  id: string,
  userId: string,
  data: Partial<IBudget>,
) => {
  return Budget.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
  });
};

export const deleteBudget = async (id: string, userId: string) => {
  return Budget.findOneAndDelete({ _id: id, user: userId });
};
