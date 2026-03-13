export interface CurrencyApiResponse {
  quotes: Record<string, number>;
  source: string;
  success: boolean;
}

export interface CurrencyRates {
  base: string;
  rates: Record<string, number>;
}
