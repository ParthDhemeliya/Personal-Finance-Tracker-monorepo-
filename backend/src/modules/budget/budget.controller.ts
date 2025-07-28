import { Request, Response, NextFunction } from 'express';
import Budget from '../../../models/Budget.js';
import { budgetSchema } from './budget.validator.js';

export const getBudgets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const budgets = await Budget.find({ user: userId });
    res.status(200).json(budgets);
  } catch (err) {
    next(err);
  }
};

export const createBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const parsed = budgetSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ message: 'Validation failed', errors: parsed.error.errors });
      return;
    }
    const budget = await Budget.create({ ...parsed.data, user: userId });
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};

export const updateBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const parsed = budgetSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ message: 'Validation failed', errors: parsed.error.errors });
      return;
    }
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      parsed.data,
      { new: true },
    );
    if (!updated) {
      res.status(404).json({ message: 'Budget not found.' });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    await Budget.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });
    res.status(204).json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
