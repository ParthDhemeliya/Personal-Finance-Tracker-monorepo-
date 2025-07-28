import { Request, Response, NextFunction } from 'express';
import Transaction from '../../../models/Transaction.js';
import mongoose from 'mongoose';

export const getExpenseStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const period = (req.query.period as string) || 'month';
  let groupBy: { year: { $year: string }; month?: { $month: string } };
  let dateFrom: Date;

  const now = new Date();
  if (period === 'month') {
    groupBy = { year: { $year: '$date' }, month: { $month: '$date' } };
    dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else if (period === 'year') {
    groupBy = { year: { $year: '$date' } };
    dateFrom = new Date(now.getFullYear() - 1, 0, 1);
  } else {
    res.status(400).json({ message: 'Invalid period' });
    return;
  }

  try {
    // Current period
    const current = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: dateFrom },
        },
      },
      { $group: { _id: groupBy, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 2 },
    ]);

    let percentChange = null;
    if (current.length === 2) {
      const latest = current[0].total;
      const previous = current[1].total;
      percentChange =
        previous === 0 ? null : ((latest - previous) / previous) * 100;
    }

    res.status(200).json({
      current: current[0]?.total || 0,
      previous: current[1]?.total || 0,
      percentChange,
    });
  } catch (err) {
    next(err);
  }
};
