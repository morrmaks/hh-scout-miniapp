import type { ApiCurrency, CurrencyApiResponse, CurrencyRates } from './currency.types';

import { currencyRatesCache } from '../../cache/currency.cache';
import { fetchCurrencyRates } from './currency.client';

const CURRENCIES: readonly ApiCurrency[] = [
  'USD',
  'EUR',
  'RUB',
  'UAH',
  'KZT',
  'KGS',
  'GEL',
  'AZN',
  'UZS',
  'BYN'
];

export async function getCurrencyRates(): Promise<CurrencyRates> {
  const cached = currencyRatesCache.get('latest');
  if (cached) return cached;

  const data = await fetchCurrencyRates<CurrencyApiResponse>('/live', {
    source: 'USD',
    currencies: CURRENCIES.join(',')
  });

  if (!data.success) {
    throw new Error(`Currency API error: ${JSON.stringify(data)}`);
  }

  const rates: CurrencyRates = {
    base: 'USD',
    rates: {
      USD: 1,
      EUR: data.quotes.USDEUR,
      RUB: data.quotes.USDRUB,
      UAH: data.quotes.USDUAH,
      KZT: data.quotes.USDKZT,
      KGS: data.quotes.USDKGS,
      GEL: data.quotes.USDGEL,
      AZN: data.quotes.USDAZN,
      UZS: data.quotes.USDUZS,
      BYN: data.quotes.USDBYN
    }
  };

  currencyRatesCache.set('latest', rates);

  return rates;
}
