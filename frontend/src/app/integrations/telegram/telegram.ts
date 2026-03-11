import type { TelegramUser, TelegramWebApp } from './telegram.types';

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window?.Telegram?.WebApp ?? null;
}

export function getTelegramUser(): TelegramUser | null {
  const tg = getTelegram();
  if (!tg) return null;
  return tg.initDataUnsafe?.user ?? null;
}
