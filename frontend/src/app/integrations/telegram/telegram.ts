import type { TelegramUser, TelegramWebApp } from './telegram.types';

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window?.Telegram?.WebApp ?? null;
}

export function getTelegramInitData(): string | null {
  const tg = getTelegram();
  if (!tg) return null;
  return tg.initData ?? null;
}

export function getTelegramUser(): TelegramUser | null {
  const tg = getTelegram();
  if (!tg) return null;
  return tg.initDataUnsafe?.user ?? null;
}

export function disableTelegramVerticalSwipes() {
  const tg = getTelegram();
  if (!tg) return;

  try {
    tg.disableVerticalSwipes?.();
  } catch (e) {
    console.warn('disableVerticalSwipes failed', e);
  }
}

export function enableTelegramVerticalSwipes() {
  const tg = getTelegram();
  if (!tg) return;

  try {
    tg.enableVerticalSwipes?.();
  } catch (e) {
    console.warn('enableVerticalSwipes failed', e);
  }
}