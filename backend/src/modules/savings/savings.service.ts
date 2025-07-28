import * as SavingsRepo from './savings.repository.js';
import { ISavingsGoal } from './savings.interface.js';

export const getSavingsGoal = async (userId: string) => {
  return SavingsRepo.findSavingsGoalByUser(userId);
};

export const createSavingsGoal = async (goal: ISavingsGoal) => {
  return SavingsRepo.createSavingsGoal(goal);
};
