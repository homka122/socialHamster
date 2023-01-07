import jwt from 'jsonwebtoken'
import TokenRepository from '../models/token.js'
import bcrypt from 'bcryptjs'

class AuthService {
  accessJwtSecret = process.env.JWT_ACCESS_SECRET
  refreshJwtSecret = process.env.JWT_REFRESH_SECRET

  hashPassowrd = async (password) => {
    const hash = await bcrypt.hash(password, 8)
    return hash
  }

  generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, this.accessJwtSecret, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, this.refreshJwtSecret, { expiresIn: '15d' })
    return { accessToken, refreshToken }
  }

  // User already exists
  saveTokenToDB = async (token, user) => {
    // update if old record don't exists
    await TokenRepository.updateOne({ user: user._id }, { token, user }, { upsert: true })
  }

  isPasswordCorrect = async (password, hash) => {
    const isPasswordCorrect = await bcrypt.compare(password, hash)
    return isPasswordCorrect
  }

  verifyRefreshToken = (refreshToken) => {
    try {
      return jwt.verify(refreshToken, this.refreshJwtSecret)
    } catch (e) {
      return undefined
    }
  }

  verifyAccessToken = (accessToken) => {
    try {
      return jwt.verify(accessToken, this.accessJwtSecret)
    } catch (e) {
      return undefined
    }
  }
}

const authService = new AuthService();

export default authService