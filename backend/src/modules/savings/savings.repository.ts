import SavingsGoal from '../../../models/SavingsGoal.js';
import { ISavingsGoal } from './savings.interface.js';

export const findSavingsGoalByUser = async (userId: string) => {
  return SavingsGoal.findOne({ user: userId });
};

export const createSavingsGoal = async (goal: ISavingsGoal) => {
  return SavingsGoal.create(goal);
};
