import type { ApiCurrency, CurrencyRates } from '../integrations/currency';
import type { HHCurrency } from '../integrations/hh';

export function convertCurrency(
  amount: number,
  from: HHCurrency,
  to: HHCurrency,
  rates: CurrencyRates
) {
  const f = normalizeToApiCurrency(from);
  const t = normalizeToApiCurrency(to);

  if (f === t) return amount;

  const fromRate = rates.rates[f];
  const toRate = rates.rates[t];

  if (!fromRate || !toRate) return Number.NaN;

  const usd = amount / fromRate;
  return usd * toRate;
}

export function normalizeToApiCurrency(currency: HHCurrency): ApiCurrency {
  if (currency === 'RUR') return 'RUB';
  if (currency === 'BYR') return 'BYN';
  return currency;
}
