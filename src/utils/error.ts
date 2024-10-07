import { Request, Response, NextFunction } from "express";

// Custom error class
class AppError extends Error {
  statusCode: number;
  success: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // This line is necessary for proper prototype chain inheritance
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Error handling middleware
const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let success = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    success = err.success;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success,
    statusCode,
    message,
  });
};

export { AppError, errorHandler };

