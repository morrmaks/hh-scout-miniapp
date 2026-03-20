import type { FlatArea } from '../utils/flattenAreas';

import { areasCache } from '../cache/areas.cache';
import { getAreas as getAreasFromHh } from '../integrations/hh';
import { flattenAreas } from '../utils/flattenAreas';

export async function getAreas(): Promise<FlatArea[]> {
  const cached = areasCache.get('areas');
  if (cached) return cached;

  const data = await getAreasFromHh();
  const flat = flattenAreas(data);

  areasCache.set('areas', flat);

  return flat;
}
