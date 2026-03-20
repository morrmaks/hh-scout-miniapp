import { getEnv } from '@/utils/env';

import 'dotenv/config';

export const env = {
  PORT: Number(getEnv('PORT')) || 3000,
  NODE_ENV: getEnv('NODE_ENV'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN'),
  DATABASE_URL: getEnv('DATABASE_URL'),
  EXCHANGERATE_ACCESS_KEY: getEnv('EXCHANGERATE_ACCESS_KEY'),
  BOT_TOKEN: getEnv('BOT_TOKEN')
};
