import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TelegramUser } from '@/app/integrations/telegram/telegram.types';

import { getTelegram, getTelegramUser } from '@/app/integrations/telegram';

export const useTelegramStore = defineStore('telegram', () => {
  const user = ref<TelegramUser | null>(null);

  const scheme = ref<'dark' | 'light'>('dark');

  function init() {
    const tg = getTelegram();
    if (!tg) return;

    user.value = getTelegramUser();

    tg.ready();
    tg.expand();

    scheme.value = tg.colorScheme === 'dark' ? 'dark' : 'light';

    tg.onEvent('themeChanged', () => {
      scheme.value = tg.colorScheme === 'dark' ? 'dark' : 'light';
    });
  }

  return {
    user,
    scheme,
    init
  };
});
