import { Request, Response, NextFunction } from 'express';
import { getCurrentSavings } from './savings.current.service.js';

export const getCurrentSavingsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const current = await getCurrentSavings(userId);
    res.status(200).json({ current });
  } catch (err) {
    next(err);
  }
};
