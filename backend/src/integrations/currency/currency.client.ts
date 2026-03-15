import process from 'node:process';

const BASE = 'https://api.exchangerate.host';

const ACCESS_KEY = process.env.EXCHANGERATE_ACCESS_KEY;

export async function fetchCurrencyRates<T>(
  path: string,
  params?: Record<string, number | string>
): Promise<T> {
  const url = new URL(BASE + path);

  if (ACCESS_KEY) url.searchParams.set('access_key', ACCESS_KEY);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Currency API error: ${res.status}`);
  }

  return res.json();
}
