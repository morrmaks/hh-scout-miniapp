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

export interface TelegramBackButton {
  hide: () => void;
  onClick: (cb: () => void) => void;
  show: () => void;
}

export type TelegramEvent = (string & {}) | 'themeChanged';

export interface TelegramWebApp {
  BackButton: TelegramBackButton;

  colorScheme: 'dark' | 'light';

  initData?: string;

  initDataUnsafe?: {
    user?: TelegramUser;
  };

  themeParams?: TelegramThemeParams;

  disableVerticalSwipes: () => void
  enableVerticalSwipes: () => void

  expand: () => void;

  onEvent: (event: TelegramEvent, cb: () => void) => void;
  ready: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
