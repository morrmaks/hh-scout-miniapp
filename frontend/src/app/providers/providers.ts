import type { App } from 'vue';

import { useTelegramStore } from '@/modules/telegram';

import { createPiniaInstance } from './pinia';
import { setupTheme } from './theme';

export async function setupProviders(app: App) {
  const pinia = createPiniaInstance();

  app.use(pinia);

  const telegram = useTelegramStore();
  telegram.init();

  await setupTheme();
}
