import { Request, Response, NextFunction } from 'express';
import {
  httpRequestDurationMicroseconds,
  httpRequestCounter,
} from '../utils/metrics.js';

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  // Record end time and calculate duration on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route ? req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();

    // Observe the request duration
    httpRequestDurationMicroseconds
      .labels(method, path, statusCode)
      .observe(duration / 1000); // Convert to seconds

    // Increment the request counter
    httpRequestCounter.labels(method, path, statusCode).inc();
  });

  next();
};
