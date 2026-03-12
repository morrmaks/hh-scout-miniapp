export function cleanObject<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== undefined && v !== '';
    })
  ) as Partial<T>;
}

export function equalObjects<T extends Record<string, unknown>>(a: T, b: T) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    const v1 = a[key as keyof T];
    const v2 = b[key as keyof T];

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
