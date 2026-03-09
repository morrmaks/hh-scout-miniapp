import type { JobsFiltersType } from '../types/types';

export function equalFilters(a: JobsFiltersType, b: JobsFiltersType) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    const v1 = a[key as keyof JobsFiltersType];
    const v2 = b[key as keyof JobsFiltersType];

    if (Array.isArray(v1) || Array.isArray(v2)) {
      const arr1 = Array.isArray(v1) ? v1 : [];
      const arr2 = Array.isArray(v2) ? v2 : [];

      if (arr1.length !== arr2.length) return false;
      if (arr1.some((v, i) => v !== arr2[i])) return false;

      continue;
    }

    if (v1 !== v2) return false;
  }

  return true;
}
