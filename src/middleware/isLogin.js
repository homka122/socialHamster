import authService from "../service/auth.js";
import UserRepository from "../models/user.js";
import { ApiError } from "../utils/ApiError.js"

export const isLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  const accessToken = authorization?.split(' ')[1]

  if (!accessToken) {
    return next(new ApiError('Пользователь не авторизован', 403))
  }

  const decodedAccessToken = authService.verifyAccessToken(accessToken)
  if (!decodedAccessToken) {
    return next(new ApiError('Невалидный access token', 403))
  }

  const { username } = decodedAccessToken
  const user = await UserRepository.findOne({ username })
  if (!user) {
    return next(new ApiError('Пользователя с таким access token нет.', 403))
  }

  req.user = user;
  next();
}