import { Request, Response, NextFunction } from 'express';
import Category from '../../../models/Category.js';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};
