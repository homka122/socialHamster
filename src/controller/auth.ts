import { Request, Response, NextFunction } from 'express';
import TokenRepository from '../models/token';
import UserRepository, { IUser } from '../models/user';
import authService from '../service/auth';
import { AccessTokenPayload } from '../types/AccessTokenPayload';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';

const maxAgeRefreshCookie = 15 * 24 * 60 * 60 * 1000; // 15 days

class AuthController {
  sendAccessTokenAndSetRefreshToken = catchAsync(async (user: IUser, res: Response) => {
    const { username, role, _id } = user;
    const userForSend = { username, role, _id };

    const { accessToken, refreshToken } = authService.generateTokens({ username, role });
    await authService.saveTokenToDB(refreshToken, user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: maxAgeRefreshCookie });
    res.status(200).send({ status: 'success', data: { user: userForSend, accessToken } });
  });

  signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const user = await UserRepository.findOne({ usernameLowerCase: username.toLowerCase() }).select('+password');

    if (user) {
      return next(new ApiError('Пользователь с таким никнеймом уже существует', 400));
    }

    const hashedPassword = await authService.hashPassowrd(password);
    const createdUser = await UserRepository.create({
      username,
      password: hashedPassword,
      usernameLowerCase: username.toLowerCase(),
    });

    this.sendAccessTokenAndSetRefreshToken(createdUser, res);
  });

  login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const user = await UserRepository.findOne({ usernameLowerCase: username.toLowerCase() }).select('+password');

    if (!user) {
      return next(new ApiError('Неверный никнейм или пароль!', 400));
    }

    const isPasswordCorrect = await authService.isPasswordCorrect(password, user.password);
    if (!isPasswordCorrect) {
      return next(new ApiError('Неверный никнейм или пароль!', 400));
    }

    this.sendAccessTokenAndSetRefreshToken(user, res);
  });

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new ApiError('Refresh token истёк или отсутстувует в cookies["refreshToken"]', 403));
    }

    const decodedRefreshToken = authService.verifyRefreshToken(refreshToken) as AccessTokenPayload | undefined;
    if (!decodedRefreshToken) {
      return next(new ApiError('Невалидный refresh token', 403));
    }

    const tokenFromDB = await TokenRepository.findOne({ token: refreshToken });
    if (!tokenFromDB) {
      return next(new ApiError('Невалидный refresh token', 403));
    }

    const user = await UserRepository.findOne({ username: decodedRefreshToken.username }).select('+password');
    if (!user) return next(new ApiError('Пользователя с таким именем не существует.'));

    this.sendAccessTokenAndSetRefreshToken(user, res);
  };
}

const authController = new AuthController();

export default authController;
