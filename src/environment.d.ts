import { UserDto } from './types/Dto';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URL: string | undefined;
      PORT: string | undefined;
      JWT_ACCESS_SECRET: string | undefined;
      JWT_REFRESH_SECRET: string | undefined;
    }
  }
}

export {};
