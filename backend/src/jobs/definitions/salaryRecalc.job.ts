import { recalcFavoriteSalaries } from '../handlers/recalcFavoriteSalaries';

export const salaryRecalcJob = {
  key: 'salary_recalc',
  intervalMs: 1000 * 60 * 60 * 24 * 28, // ~28 дней
  handler: recalcFavoriteSalaries
};
