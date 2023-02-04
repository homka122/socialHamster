import authService from '../service/auth';
import UserRepository from '../models/user';
import { ApiError } from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AccessTokenPayload } from '../types/AccessTokenPayload';

export const isLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const accessToken = authorization?.split(' ')[1];

  if (!accessToken) {
    return next(new ApiError('Пользователь не авторизован', 403));
  }

  const decodedAccessToken = authService.verifyAccessToken(accessToken);
  if (!decodedAccessToken) {
    return next(new ApiError('Невалидный access token', 403));
  }

  const { username } = decodedAccessToken as AccessTokenPayload;
  const user = await UserRepository.findOne({ username });
  if (!user) {
    return next(new ApiError('Пользователя с таким access token нет.', 403));
  }

  req.user = user;
  next();
};
