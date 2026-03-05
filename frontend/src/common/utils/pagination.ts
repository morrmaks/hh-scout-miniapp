export type PaginationItem = { type: 'dots' } | { type: 'page'; page: number };

export function buildPagination(current: number, total: number, window = 2): PaginationItem[] {
  const result: PaginationItem[] = [];

  const start = Math.max(1, current - window);
  const end = Math.min(total, current + window);

  if (start > 1) {
    result.push({ type: 'page', page: 1 });

    if (start > 2) {
      result.push({ type: 'dots' });
    }
  }

  for (let i = start; i <= end; i++) {
    result.push({ type: 'page', page: i });
  }

  if (end < total) {
    if (end < total - 1) {
      result.push({ type: 'dots' });
    }

    result.push({ type: 'page', page: total });
  }

  return result;
}
