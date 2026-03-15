import type { User } from '@telegram-apps/init-data-node';

export type TelegramUser = User;

export interface TelegramThemeParams {
  bg_color?: string;
  button_color?: string;
  button_text_color?: string;
  hint_color?: string;
  link_color?: string;
  text_color?: string;
}

export interface TelegramWebApp {
  colorScheme: 'dark' | 'light';

  initData?: string;

  initDataUnsafe?: {
    user?: TelegramUser;
  };

  themeParams?: TelegramThemeParams;

  expand: () => void;
  onEvent: (event: 'themeChanged', cb: () => void) => void;
  ready: () => void;
}

export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
