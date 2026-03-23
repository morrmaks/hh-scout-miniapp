import type { User } from '@telegram-apps/init-data-node';

export type TelegramUser = Omit<User, 'id'> & {
  id: string;
};
