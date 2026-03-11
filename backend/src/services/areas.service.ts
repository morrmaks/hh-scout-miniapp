import type { FlatArea } from '../utils/flattenAreas';

import { areasCache } from '../cache/areasCache';
import { fetchRetry } from '../utils/fetchRetry';
import { flattenAreas } from '../utils/flattenAreas';

export interface Area {
  areas: Area[];
  id: string;
  name: string;
}

export async function getAreas(): Promise<FlatArea[]> {
  const cached = areasCache.get('areas');
  if (cached) return cached;

  const res = await fetchRetry('https://api.hh.ru/areas');
  const data = (await res.json()) as Area[];

  const flat = flattenAreas(data);

  areasCache.set('areas', flat);

  return flat;
}
