import { Request, Response, NextFunction } from 'express';
import Transaction from '../../../models/Transaction.js';

export const getIncomeSources = async (
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
    const sources = await Transaction.distinct('source', {
      user: userId,
      type: 'income',
    });
    res.status(200).json(sources);
  } catch (err) {
    next(err);
  }
};
