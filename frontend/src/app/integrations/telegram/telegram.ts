import type { TelegramWebApp } from './telegram.types';

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window?.Telegram?.WebApp ?? null;
}
