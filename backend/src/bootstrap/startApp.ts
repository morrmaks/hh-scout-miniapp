import cors from 'cors';
import express from 'express';

import { env } from '@/config/env';
import { errorMiddleware } from '@/middleware/error.middleware';
import { router } from '@/router';

import { startCacheCleanup } from './startCache';
import { startJobs } from './startJobs';

const PORT = env.PORT;

const isDev = env.NODE_ENV !== 'production';

const allowedOrigins = env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? [];

if (!isDev && !allowedOrigins.length) throw new Error('CORS_ORIGIN is required in production');

export async function startApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);

        if (allowedOrigins.includes(origin)) {
          return cb(null, true);
        }

        if (isDev) {
          console.warn(`Dev CORS allow: ${origin}`);
          return cb(null, true);
        }

        return cb(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true
    })
  );

  app.use(express.json());
  app.use('/api', router);
  app.use(errorMiddleware);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
  });

  await startJobs();
  startCacheCleanup();
}
