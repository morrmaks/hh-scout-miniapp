export type PaginationItem = { type: 'dots' } | { type: 'page'; page: number };

export function buildPagination(current: number, total: number, window = 2): PaginationItem[] {
  if (total <= 0) return [];

  const page = Math.min(Math.max(current, 1), total);

  const start = Math.max(1, page - window);
  const end = Math.min(total, page + window);

  const items: PaginationItem[] = [];

  const pushPage = (p: number) => items.push({ type: 'page', page: p });

  if (start > 1) {
    pushPage(1);
    if (start > 2) items.push({ type: 'dots' });
  }

  for (let p = start; p <= end; p++) {
    pushPage(p);
  }

  if (end < total) {
    if (end < total - 1) items.push({ type: 'dots' });
    pushPage(total);
  }

  return items;
}
