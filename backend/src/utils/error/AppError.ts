export class AppError extends Error {
  statusCode: number;
  details?: string | object;

  constructor(message: string, statusCode = 500, details?: string | object) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
