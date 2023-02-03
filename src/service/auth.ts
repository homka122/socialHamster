import jwt from 'jsonwebtoken';
import TokenRepository from '../models/token.js';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/user.js';
import { AccessTokenPayload } from '../types/AccessTokenPayload.js';

class AuthService {
  accessJwtSecret = process.env.JWT_ACCESS_SECRET;
  refreshJwtSecret = process.env.JWT_REFRESH_SECRET;

  hashPassowrd = async (password: string) => {
    const hash = await bcrypt.hash(password, 8);
    return hash;
  };

  generateTokens = (payload: object) => {
    const accessToken = jwt.sign(payload, this.accessJwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, this.refreshJwtSecret, { expiresIn: '15d' });
    return { accessToken, refreshToken };
  };

  saveTokenToDB = async (token: string, user: IUser) => {
    // create if old record don't exists
    await TokenRepository.updateOne({ user: user._id }, { token, user }, { upsert: true });
  };

  isPasswordCorrect = async (password: string, hash: string) => {
    const isPasswordCorrect = await bcrypt.compare(password, hash);
    return isPasswordCorrect;
  };

  verifyRefreshToken = (refreshToken: string) => {
    try {
      return jwt.verify(refreshToken, this.refreshJwtSecret) as AccessTokenPayload;
    } catch (e) {
      return undefined;
    }
  };

  verifyAccessToken = (accessToken: string) => {
    try {
      return jwt.verify(accessToken, this.accessJwtSecret) as AccessTokenPayload;
    } catch (e) {
      return undefined;
    }
  };
}

const authService = new AuthService();

export default authService;
