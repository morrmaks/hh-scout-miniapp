export function parseNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parseStringArray(value: unknown): string[] {
  if (!value) return [];

  return Array.isArray(value) ? value.map(String) : [String(value)];
}

export function hasQueryParams<K extends readonly string[]>(
  query: Record<string, unknown>,
  keys: K
) {
  return keys.some((key) => key in query);
}
