import type { JobFilters } from '../types/types';

function normalizeArray(arr?: string[]) {
  if (!arr || arr.length === 0) return '';
  return [...arr].sort().join(',');
}

export function buildSearchKey(filters: JobFilters) {
  return JSON.stringify({
    text: filters.text ?? '',
    order: filters.order_by ?? '',
    salary: filters.salary ?? '',
    currency: filters.currency ?? '',
    period: filters.period ?? '',
    perPage: filters.per_page ?? '',
    experience: filters.experience ?? '',
    employment: normalizeArray(filters.employment_form),
    format: normalizeArray(filters.work_format),
    schedule: normalizeArray(filters.work_schedule_by_days),
    area: normalizeArray(filters.area),
    label: normalizeArray(filters.label)
  });
}
