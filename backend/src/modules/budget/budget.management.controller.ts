import { Request, Response, NextFunction } from 'express';
// Placeholder for Budget model import
// import Budget from '../../../models/Budget';

export const createBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    // const budget = await Budget.create({ ...req.body, user: userId });
    const budget = { ...req.body, user: userId, _id: 'mock' };
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
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    // const updated = await Budget.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, { new: true });
    const updated = { ...req.body, user: userId, _id: req.params.id };
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
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    // const deleted = await Budget.findOneAndDelete({ _id: req.params.id, user: userId });
    const deleted = true;
    if (!deleted) return res.status(404).json({ message: 'Budget not found.' });
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (err) {
    next(err);
  }
};
