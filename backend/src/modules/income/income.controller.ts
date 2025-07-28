import { NextFunction, Request, Response } from 'express';
import { IncomeService } from './income.service.js';
import Transaction from '../../../models/Transaction.js';
import mongoose from 'mongoose';

export const getAllIncomes = async (
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
    const incomes = await IncomeService.getIncomes(userId);
    res.status(200).json(incomes);
  } catch (err) {
    next(err);
  }
};
export const getPaginatedIncomes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;

  try {
    const result = await IncomeService.getPaginatedIncomes(userId, page, limit);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createIncome = async (
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
    const income = await IncomeService.createIncome({
      ...req.body,
      user: userId,
    });
    res.status(201).json(income);
  } catch (err) {
    next(err);
  }
};

export const updateIncome = async (
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
    const updated = await IncomeService.updateIncome(
      req.params.id,
      userId,
      req.body,
    );
    if (!updated) {
      res.status(404).json({ message: 'Income not found.' });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
// delete  income
export const deleteIncome = async (
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
    const deleted = await IncomeService.deleteIncome(req.params.id, userId);
    if (!deleted) {
      res.status(404).json({ message: 'Income not found.' });
      return;
    }
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// total incomes
export const getTotalIncome = async (
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
    const result = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), type: 'income' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const total = result.length > 0 ? Number(result[0].total.toString()) : 0;

    res.status(200).json({ total }); // ✅ return clean number
  } catch (err) {
    next(err);
  }
};
