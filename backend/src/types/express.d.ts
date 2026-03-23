import type { TelegramUser } from '../integrations/telegram';

declare global {
  namespace Express {
    interface Request {
      telegramUser?: TelegramUser;
    }
  }
}

export {};
