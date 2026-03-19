import cors from 'cors';
import express from 'express';

import { errorMiddleware } from '@/middleware/error.middleware';
import { router } from '@/router';

import { startCacheCleanup } from './startCache';
import { startJobs } from './startJobs';

export async function startApp() {
  const app = express();

  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://unopted-jame-unmenaced.ngrok-free.dev'
        // 'https://my-vercel.app',
      ],
      credentials: true
    })
  );

  app.use(express.json());
  app.use('/api', router);
  app.use(errorMiddleware);

  app.listen(3000, () => {
    console.log('API running on http://localhost:3000');
  });

  await startJobs();
  startCacheCleanup();
}
