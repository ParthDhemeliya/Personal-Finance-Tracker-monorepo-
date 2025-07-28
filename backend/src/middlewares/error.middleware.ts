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

  // Log error details for debugging
  console.error('Error occurred:', {
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    body: req.body,
    stack: err.stack
  });

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Something went wrong',
    ...(err.details && { errors: err.details }),
    // Add debug info in development
    ...(process.env.NODE_ENV === 'development' && {
      debug: {
        path: req.path,
        method: req.method,
        body: req.body
      }
    })
  });
};
