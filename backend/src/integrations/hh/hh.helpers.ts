import type { JobFilters } from '../../types/jobs.types';

export function buildSearchParams(filters: JobFilters) {
  const params = new URLSearchParams();

  if (filters.text) params.set('text', filters.text);

  const perPage = Math.min(filters.per_page ?? 100, 100);

  params.set('page', String(filters.page ?? 0));
  params.set('per_page', String(perPage));

  if (filters.order_by) params.set('order_by', filters.order_by);
  if (filters.period) params.set('period', String(filters.period));

  if (filters.salary) params.set('salary', String(filters.salary));

  if (filters.salary !== undefined && !filters.currency) {
    params.set('currency', 'RUR');
  }

  if (filters.currency) params.set('currency', filters.currency);

  filters.experience?.forEach((v) => params.append('experience', v));
  filters.employment_form?.forEach((v) => params.append('employment_form', v));
  filters.work_format?.forEach((v) => params.append('work_format', v));
  filters.area?.forEach((v) => params.append('area', v));
  filters.label?.forEach((v) => params.append('label', v));

  return params;
}
