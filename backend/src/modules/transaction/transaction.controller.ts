import { Request, Response, NextFunction } from 'express';

import * as TransactionService from './transaction.service.js';

export const getRecentTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 5;

  try {
    const transactions = await TransactionService.getRecentTransactions(
      userId,
      limit,
    );
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};
