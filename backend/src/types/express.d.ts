import type { TelegramUser } from './telegram.types';

declare global {
  namespace Express {
    interface Request {
      telegramUser?: TelegramUser;
    }
  }
}

export {};
