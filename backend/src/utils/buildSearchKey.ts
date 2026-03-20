import type { JobFilters } from '../types/jobs.types';

function normalizeArray(arr?: string[]) {
  if (!arr || arr.length === 0) return '';
  return [...arr].sort().join(',');
}

export function buildSearchJobsKey(filters: JobFilters) {
  return JSON.stringify({
    text: filters.text ?? '',
    order: filters.order_by ?? 'relevance',
    salary: filters.salary ?? '0',
    currency: filters.currency ?? 'RUR',
    period: filters.period ?? '',
    perPage: filters.per_page ?? '100',
    experience: normalizeArray(filters.experience),
    employment: normalizeArray(filters.employment_form),
    format: normalizeArray(filters.work_format),
    area: normalizeArray(filters.area),
    label: normalizeArray(filters.label)
  });
}
