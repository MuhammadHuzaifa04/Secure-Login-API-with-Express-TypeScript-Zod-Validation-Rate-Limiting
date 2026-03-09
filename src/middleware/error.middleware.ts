import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../utils/httpStatus';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  error.message = err.message;

  console.error('ERROR ', err);

  // If error is not operational → convert to 500
  if (!(err instanceof AppError)) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
