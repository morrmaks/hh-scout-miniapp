import type { JobFilters } from '../types/types';

export function buildHHUrl(filters: JobFilters) {
  const params = new URLSearchParams();

  if (filters.text) params.set('text', filters.text);

  const perPage = Math.min(filters.per_page ?? 100, 100);

  const pageIndex = filters.page ?? 0;

  params.set('page', String(pageIndex));
  params.set('per_page', String(perPage));

  if (filters.order_by) params.set('order_by', filters.order_by);

  if (filters.period) params.set('period', String(filters.period));

  if (filters.salary) params.set('salary', String(filters.salary));

  if (filters.salary !== undefined && !filters.currency) params.set('currency', 'RUR');

  if (filters.currency) params.set('currency', filters.currency);

  if (filters.experience) params.append('experience', filters.experience);

  filters.employment_form?.forEach((v) => params.append('employment_form', v));

  filters.work_format?.forEach((v) => params.append('work_format', v));

  filters.work_schedule_by_days?.forEach((v) => params.append('work_schedule_by_days', v));

  filters.area?.forEach((v) => params.append('area', v));

  filters.label?.forEach((v) => params.append('label', v));

  return `https://api.hh.ru/vacancies?${params.toString()}`;
}
