import type { Area } from '../services/areasService';

export interface FlatArea {
  id: string;
  name: string;
}

export function flattenAreas(areas: Area[]): FlatArea[] {
  const result: FlatArea[] = [];
  const stack = [...areas];

  while (stack.length) {
    const area = stack.pop()!;

    if (area.areas?.length) {
      stack.push(...area.areas);
    } else {
      result.push({
        id: area.id,
        name: area.name
      });
    }
  }

  return result;
}
