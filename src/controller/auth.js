import TokenRepository from "../models/token.js";
import UserRepository from "../models/user.js";
import authService from "../service/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { catchAsync } from "../utils/catchAsync.js";

class AuthController {
  sendAccessTokenAndSetRefreshToken = async (user, res) => {
    const { username, role, _id } = user
    const userForSend = { username, role, _id }

    const { accessToken, refreshToken } = authService.generateTokens({ username, role })
    await authService.saveTokenToDB(refreshToken, user)

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 })
    res.status(200).send({ status: 'success', data: { user: userForSend, accessToken } })
  }

  signup = catchAsync(async (req, res, next) => {
    const { username, password } = req.body

    const user = await UserRepository.findOne({ username }).select('+password')

    if (user) {
      return next(new ApiError('Пользователь с таким никнеймом уже существует', 400))
    }

    const hashedPassword = await authService.hashPassowrd(password)
    const createdUser = await UserRepository.create({ username, password: hashedPassword })

    this.sendAccessTokenAndSetRefreshToken(createdUser, res)
  })

  login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body
    const user = await UserRepository.findOne({ username }).select('+password')

    if (!user) {
      return next(new ApiError('Неверный никнейм или пароль!', 400))
    }

    const isPasswordCorrect = await authService.isPasswordCorrect(password, user.password)
    if (!isPasswordCorrect) {
      return next(new ApiError('Неверный никнейм или пароль!', 400))
    }

    this.sendAccessTokenAndSetRefreshToken(user, res)
  })

  refresh = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new ApiError('Refresh token истёк или отсутстувует в cookies["refreshToken"]', 403))
    }

    const decodedRefreshToken = authService.verifyRefreshToken(refreshToken)
    if (!decodedRefreshToken) {
      return next(new ApiError('Невалидный refresh token', 403))
    }

    const tokenFromDB = await TokenRepository.findOne({ token: refreshToken }).populate('user');
    if (!tokenFromDB) {
      return next(new ApiError('Невалидный refresh token', 403))
    }

    const user = await UserRepository.findOne({ username: decodedRefreshToken.username }).select('+password')

    this.sendAccessTokenAndSetRefreshToken(user, res)
  }
}

const authController = new AuthController()

export default authController;