import { parseStringArray } from '@/common/utils/query';

import type { JobsFiltersType } from '../types/jobs.types';

export interface LocalFilters {
  area?: string[];
  currency?: string;

  employment_form?: string[];
  experience?: string;

  label?: string[];
  order_by?: string;
  per_page?: number;
  period?: number;
  salary?: number;
  work_format?: string[];
}

function emptyToUndefined<T>(arr?: T[]) {
  return arr?.length ? arr : undefined;
}

export function toApiFilters(local: LocalFilters): JobsFiltersType {
  return {
    per_page: local.per_page,
    order_by: local.order_by,
    currency: local.currency,
    salary: local.salary,
    label: emptyToUndefined(local.label),

    experience: local.experience,

    employment_form: emptyToUndefined(local.employment_form),
    work_format: emptyToUndefined(local.work_format),
    area: emptyToUndefined(local.area),

    period: local.period
  };
}

/* ---------------------------------- */
/* API → UI                           */
/* ---------------------------------- */

export function toLocalFilters(filters: JobsFiltersType): LocalFilters {
  return {
    per_page: filters.per_page,
    order_by: filters.order_by,
    currency: filters.currency,
    salary: filters.salary,
    label: filters.label ?? [],
    experience: filters.experience ?? '',
    employment_form: filters.employment_form ?? [],
    work_format: filters.work_format ?? [],
    area: filters.area ?? [],
    period: filters.period ?? 0
  };
}

/* ---------------------------------- */
/* URL → Filters                      */
/* ---------------------------------- */

export function parseFilters(
  query: Record<string, unknown>,
  defaults: JobsFiltersType
): JobsFiltersType {
  const filters: JobsFiltersType = { ...defaults };

  if (query.per_page !== undefined) filters.per_page = Number(query.per_page);
  if (query.order_by !== undefined) filters.order_by = String(query.order_by);
  if (query.currency !== undefined) filters.currency = String(query.currency);
  if (query.salary !== undefined) filters.salary = Number(query.salary);
  if (query.label !== undefined) filters.label = parseStringArray(query.label);
  if (query.period !== undefined) filters.period = Number(query.period);
  if (query.experience !== undefined) filters.experience = String(query.experience);
  if (query.area !== undefined) filters.area = parseStringArray(query.area);
  if (query.employment_form !== undefined)
    filters.employment_form = parseStringArray(query.employment_form);
  if (query.work_format !== undefined) filters.work_format = parseStringArray(query.work_format);

  return filters;
}
