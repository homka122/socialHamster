import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

export const validate = (dto: Joi.ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await dto.validateAsync(req.body, { abortEarly: false });
    req.body = value;
  } catch (error) {
    const err = error as Joi.ValidationError;
    return next(new ApiError(err.details.map((err) => err.message).join('\n'), 400));
  }
  next();
};
