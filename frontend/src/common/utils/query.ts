export function parseNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parseStringArray<T extends string>(value: unknown): T[] {
  if (!value) return [];

  return Array.isArray(value) ? value.map((v) => String(v) as T) : [String(value) as T];
}

export function hasQueryParams<K extends readonly string[]>(
  query: Record<string, unknown>,
  keys: K
) {
  return keys.some((key) => key in query);
}
