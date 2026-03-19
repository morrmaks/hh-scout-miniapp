import cron from 'node-cron';

import { runJobs } from '../index';

export function startScheduler() {
  cron.schedule('0 * * * *', async () => {
    console.log('[jobs] running scheduler');

    try {
      await runJobs();
    } catch (err) {
      console.error('[jobs] scheduler failed', err);
    }
  });
}
