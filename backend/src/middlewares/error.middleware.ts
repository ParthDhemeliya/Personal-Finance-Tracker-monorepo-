import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error/AppError.js';

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Something went wrong',
    ...(err.details && { errors: err.details }),
  });
};
