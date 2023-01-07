import authService from "../service/auth.js";
import UserRepository from "../models/user.js";

export const isLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  const accessToken = authorization?.split(' ')[1]

  if (!accessToken) {
    return next(new Error('Пользователь не авторизован'))
  }

  const decodedAccessToken = authService.verifyAccessToken(accessToken)
  if (!decodedAccessToken) {
    return next(new Error('Невалидный access token'))
  }

  const { username } = decodedAccessToken
  const user = await UserRepository.findOne({ username })
  if (!user) {
    return next(new Error('Пользователя с таким access token нет.'))
  }

  req.user = user;
  next();
}