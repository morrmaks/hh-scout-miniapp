import cors from 'cors';
import express from 'express';

import { areasCache } from './cache/areas.cache';
import { currencyRatesCache } from './cache/currency.cache';
import { searchSessions, vacancyCache } from './cache/jobs.cache';
import { errorMiddleware } from './middleware/error.middleware';
import { router } from './router/index';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});

setInterval(
  () => {
    vacancyCache.cleanup();
    searchSessions.cleanup();
    areasCache.cleanup();
    currencyRatesCache.cleanup();

    console.log(
      'Cache cleanup',
      'search:',
      searchSessions.size(),
      'vacancies:',
      vacancyCache.size(),
      'areas:',
      areasCache.size(),
      'currency:',
      currencyRatesCache.size()
    );
  },
  24 * 60 * 60 * 1000
);
