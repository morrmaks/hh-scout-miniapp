import cron from 'node-cron';

import { recalcFavoriteSalaries } from '../db';

cron.schedule('0 3 1 * *', async () => {
  console.log('Starting salary recalculation');

  try {
    await recalcFavoriteSalaries();
    console.log('Salary recalculation completed');
  } catch (err) {
    console.error('Salary recalculation failed', err);
  }
});
