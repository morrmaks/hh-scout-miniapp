import type { Area } from '../services/areasService';

export interface FlatArea {
  id: string;
  name: string;
}

export function flattenAreas(areas: Area[]): FlatArea[] {
  const russia = areas.find((a) => a.id === '113');
  if (!russia) return [];

  return russia.areas.map((region) => ({
    id: region.id,
    name: region.name
  }));
}
