import UserRepository from "../models/user.js";
import authService from "../service/auth.js";

class AuthController {
  sendAccessTokenAndSetRefreshToken = async (user, res) => {
    const { username, role, _id } = user
    const userForSend = { username, role, _id }

    const { accessToken, refreshToken } = authService.generateTokens({ username, role })
    await authService.saveTokenToDB(refreshToken, user)

    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.status(200).send({ status: 'success', data: { user: userForSend, accessToken } })
  }

  signup = async (req, res, next) => {
    const { username, password } = req.body
    const user = await UserRepository.findOne({ username })

    if (user) {
      throw Error('Пользователь с таким никнеймом уже существует')
    }

    const hashedPassword = await authService.hashPassowrd(password)
    const newUser = await UserRepository.create({ username, password: hashedPassword })

    this.sendAccessTokenAndSetRefreshToken(newUser, res)
  }

  login = async (req, res, next) => {
    const { username, password } = req.body
    const user = await UserRepository.findOne({ username })

    if (!user) {
      throw Error('Неверный никнейм или пароль!')
    }

    const isPasswordCorrect = await authService.isPasswordCorrect(password, user.password)
    if (!isPasswordCorrect) {
      throw Error('Неверный никнейм или пароль!')
    }

    this.sendAccessTokenAndSetRefreshToken(user, res)
  }

  refresh = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw Error('Refresh token истёк или отсутстувует в cookies["refreshToken"]')
    }

    const decodedRefreshToken = authService.verifyRefreshToken(refreshToken)
    if (!decodedRefreshToken) {
      throw Error('Невалидный refresh token')
    }

    const user = await UserRepository.findOne({ username: decodedRefreshToken.username })

    this.sendAccessTokenAndSetRefreshToken(user, res)
  }
}

const authController = new AuthController()

export default authController;