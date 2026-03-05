import type { App } from 'vue';

import { createPiniaInstance } from './pinia';

export function setupProviders(app: App) {
  const pinia = createPiniaInstance();

  app.use(pinia);
}
