import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  if (err.name === 'ValidationError' && 'errors' in err) {
    const messages = Object.values((err as { errors: Record<string, { message: string }> }).errors).map((e) => e.message);
    res.status(400).json({ message: messages.join('. ') });
    return;
  }
  if (err.name === 'MongoServerError') {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'Duplicate field value. Resource already exists.' });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};
