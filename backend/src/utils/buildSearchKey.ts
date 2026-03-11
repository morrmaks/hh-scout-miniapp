import type { JobFilters } from '../types/jobs.types';

function normalizeArray(arr?: string[]) {
  if (!arr || arr.length === 0) return '';
  return [...arr].sort().join(',');
}

export function buildSearchJobsKey(filters: JobFilters) {
  return JSON.stringify({
    text: filters.text ?? '',
    order: filters.order_by ?? '',
    salary: filters.salary ?? '',
    currency: filters.currency ?? '',
    period: filters.period ?? '',
    perPage: filters.per_page ?? '',
    experience: normalizeArray(filters.experience),
    employment: normalizeArray(filters.employment_form),
    format: normalizeArray(filters.work_format),
    area: normalizeArray(filters.area),
    label: normalizeArray(filters.label)
  });
}
