import { Request, Response, NextFunction } from 'express';
import Budget from '../../../models/Budget.js';
import Transaction from '../../../models/Transaction.js';
import Category from '../../../models/Category.js';
import mongoose from 'mongoose';

export const getBudgetOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  try {
    // Get all budgets for the user
    const budgets = await Budget.find({ user: userId });
    // Get all categories for the user (optional, if you want to show all even if not budgeted)
    // const categories = await Category.find({ user: userId });

    // Aggregate spent per category for the current month
    const spentByCategory = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          isDeleted: false,
          date: { $gte: monthStart, $lte: monthEnd },
        },
      },
      {
        $group: {
          _id: '$expenseCategory',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    // Map spent to category id for quick lookup
    const spentMap = spentByCategory.reduce(
      (acc, curr) => {
        acc[curr._id?.toString() || ''] = curr.spent;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Build overview array
    const overview = await Promise.all(
      budgets.map(async (budget) => {
        // Optionally, populate category name
        const category = await Category.findById(budget.category);
        return {
          category: category?.name || 'Unknown',
          spent: Number(spentMap[budget.category.toString()] || 0),
          budget: budget.amount,
        };
      }),
    );

    res.status(200).json(overview);
  } catch (err) {
    next(err);
  }
};
