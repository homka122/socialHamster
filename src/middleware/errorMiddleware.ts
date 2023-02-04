import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorMiddleware = (error: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ status: 'error', message: error.message });
  }

  console.log(error);
  return res.status(500).json({ status: 'error', message: 'Непридвиденная ошибка' });
};
