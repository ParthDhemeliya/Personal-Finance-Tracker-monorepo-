import { Request, Response, NextFunction } from 'express';
import { getBalanceSummary } from './balance.service.js';

export const getBalance = async (
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
    const summary = await getBalanceSummary(userId);
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
};
