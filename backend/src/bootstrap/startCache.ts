import { areasCache } from '@/cache/areas.cache';
import { currencyRatesCache } from '@/cache/currency.cache';
import { searchSessions, vacancyCache } from '@/cache/jobs.cache';

export function startCacheCleanup() {
  setInterval(
    () => {
      try {
        vacancyCache.cleanup();
        searchSessions.cleanup();
        areasCache.cleanup();
        currencyRatesCache.cleanup();

        console.log(
          '[cache]',
          'search:',
          searchSessions.size(),
          'vacancies:',
          vacancyCache.size(),
          'areas:',
          areasCache.size(),
          'currency:',
          currencyRatesCache.size()
        );
      } catch (e) {
        console.error('[cache] cleanup error', e);
      }
    },
    24 * 60 * 60 * 1000
  );
}
