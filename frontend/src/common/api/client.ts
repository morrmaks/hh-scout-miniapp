import fetches from '@siberiacancode/fetches';

import { API_URL } from '@/app/config/api';
import { getTelegramInitData } from '@/app/integrations/telegram';

const instance = fetches.create({
  baseURL: API_URL
});

instance.interceptors.request.use((config) => {
  const initData = getTelegramInitData();

  if (!initData) return config;

  if (!config.headers) config.headers = {};

  config.headers['x-telegram-init-data'] = initData;

  return config;
});

export { instance };
