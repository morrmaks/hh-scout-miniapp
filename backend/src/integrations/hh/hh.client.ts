import { fetchRetry } from '../../utils/fetchRetry';

const BASE = 'https://api.hh.ru';

export async function hhFetch<T>(path: string): Promise<T> {
  const res = await fetchRetry(`${BASE}${path}`);

  if (!res.ok) {
    throw new Error(`HH API error: ${res.status}`);
  }

  return res.json();
}
