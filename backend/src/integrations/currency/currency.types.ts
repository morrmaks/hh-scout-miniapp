export interface CurrencyApiResponse {
  quotes: Record<string, number>;
  source: string;
  success: boolean;
}

export interface CurrencyRates {
  base: string;
  rates: Record<string, number>;
}

export type ApiCurrency =
  | 'AZN'
  | 'BYN'
  | 'EUR'
  | 'GEL'
  | 'KGS'
  | 'KZT'
  | 'RUB'
  | 'UAH'
  | 'USD'
  | 'UZS';
