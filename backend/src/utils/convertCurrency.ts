import type { CurrencyRates } from '../integrations/currency';

export function convertCurrency(amount: number, from: string, to: string, rates: CurrencyRates) {
  if (from === to) return amount;

  const usd = amount / rates.rates[from];
  return usd * rates.rates[to];
}
