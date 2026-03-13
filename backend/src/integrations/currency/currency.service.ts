import type { CurrencyApiResponse, CurrencyRates } from './currency.types';

import { currencyRatesCache } from '../../cache/currency.cache';
import { fetchCurrencyRates } from './currency.client';

export async function getCurrencyRates(): Promise<CurrencyRates> {
  const cached = currencyRatesCache.get('latest');
  if (cached) return cached;

  const data = await fetchCurrencyRates<CurrencyApiResponse>('/live', {
    source: 'USD',
    currencies: 'USD,EUR,RUB'
  });

  if (!data.success) {
    throw new Error('Currency API error');
  }

  const rates: CurrencyRates = {
    base: 'USD',
    rates: {
      USD: 1,
      EUR: data.quotes.USDEUR,
      RUB: data.quotes.USDRUB
    }
  };

  currencyRatesCache.set('latest', rates);

  return rates;
}
