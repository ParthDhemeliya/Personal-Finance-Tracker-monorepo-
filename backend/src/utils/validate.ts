import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './error/AppError.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return next(new AppError('Validation error', 400, formattedErrors));
      }

      return next(new AppError('Unknown validation error', 400));
    }
  };
};
