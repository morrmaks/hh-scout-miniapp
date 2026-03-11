export interface TelegramUser {
  first_name: string;
  id: number;
  language_code?: string;
  last_name?: string;
  photo_url?: string;
  username?: string;
}

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

  initDataUnsafe?: {
    user?: TelegramUser;
  };

  themeParams?: TelegramThemeParams;

  expand: () => void;
  onEvent: (event: 'themeChanged', cb: () => void) => void;

  ready: () => void;
}
