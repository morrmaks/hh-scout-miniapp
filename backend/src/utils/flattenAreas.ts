import type { Area } from '../services/areas.service';

export interface FlatArea {
  id: string;
  name: string;
}

export function flattenAreas(areas: Area[]): FlatArea[] {
  const russia = areas.find((a) => a.id === '113');
  if (!russia) return [];

  return [
    { id: russia.id, name: russia.name },
    ...russia.areas
      .map((region) => ({
        id: region.id,
        name: region.name
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  ];
}
