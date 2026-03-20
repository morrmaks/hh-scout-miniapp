import type { CurrencyRates } from '../integrations/currency';

import { LRU } from './lru';

export const currencyRatesCache = new LRU<string, CurrencyRates>(1, 24 * 60 * 60 * 1000);
