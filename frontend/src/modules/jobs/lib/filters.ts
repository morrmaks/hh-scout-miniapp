import { parseStringArray } from '@/common/utils/query';

import type { JobsFiltersType } from '../types/types';

export interface LocalFilters {
  area?: string[];
  employment_form?: string[];

  experience?: string;
  order_by?: string;

  per_page?: number;
  period?: number;
  salary?: number;

  work_format?: string[];
  work_schedule_by_days?: string[];
}

function emptyToUndefined<T>(arr?: T[]) {
  return arr?.length ? arr : undefined;
}

export function toApiFilters(local: LocalFilters): JobsFiltersType {
  return {
    per_page: local.per_page,
    order_by: local.order_by,
    salary: local.salary,

    experience: local.experience || undefined,

    employment_form: emptyToUndefined(local.employment_form),
    work_format: emptyToUndefined(local.work_format),
    work_schedule_by_days: emptyToUndefined(local.work_schedule_by_days),
    area: emptyToUndefined(local.area),

    period: local.period || undefined
  };
}

/* ---------------------------------- */
/* API → UI                           */
/* ---------------------------------- */

export function toLocalFilters(filters: JobsFiltersType): LocalFilters {
  return {
    per_page: filters.per_page,

    order_by: filters.order_by,
    salary: filters.salary,

    experience: filters.experience ?? '',

    employment_form: filters.employment_form ?? [],
    work_format: filters.work_format ?? [],
    work_schedule_by_days: filters.work_schedule_by_days ?? [],

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

  if (query.per_page) filters.per_page = Number(query.per_page);
  if (query.order_by) filters.order_by = String(query.order_by);
  if (query.salary) filters.salary = Number(query.salary);
  if (query.period) filters.period = Number(query.period);
  if (query.experience) filters.experience = String(query.experience);

  if (query.area) filters.area = parseStringArray(query.area);

  if (query.employment_form) filters.employment_form = parseStringArray(query.employment_form);

  if (query.work_format) filters.work_format = parseStringArray(query.work_format);

  if (query.work_schedule_by_days)
    filters.work_schedule_by_days = parseStringArray(query.work_schedule_by_days);

  return filters;
}
