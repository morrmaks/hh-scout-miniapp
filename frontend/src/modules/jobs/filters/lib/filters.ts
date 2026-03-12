import { parseStringArray } from '@/common/utils/query';

import type { JobsFilters, JobsQueryParams } from '../../types/jobs.types';

function emptyToUndefined<T>(arr?: T[]) {
  return arr?.length ? arr : undefined;
}

export function toApiFilters(local: JobsFilters): JobsQueryParams {
  return {
    per_page: local.per_page,
    order_by: local.order_by,
    currency: local.currency,
    salary: local.salary,
    label: emptyToUndefined(local.label),

    experience: emptyToUndefined(local.experience),

    employment_form: emptyToUndefined(local.employment_form),
    work_format: emptyToUndefined(local.work_format),
    area: emptyToUndefined(local.area),

    period: local.period
  };
}

/* ---------------------------------- */
/* API → UI                           */
/* ---------------------------------- */

export function toLocalFilters(filters: JobsQueryParams): JobsFilters {
  return {
    per_page: filters.per_page,
    order_by: filters.order_by,
    currency: filters.currency,
    salary: filters.salary,
    label: filters.label ?? [],
    experience: filters.experience ?? [],
    employment_form: filters.employment_form ?? [],
    work_format: filters.work_format ?? [],
    area: filters.area ?? [],
    period: filters.period ?? 0
  };
}

/* ---------------------------------- */
/* URL → Filters                      */
/* ---------------------------------- */

export function parseFilters(query: JobsQueryParams, defaults: JobsQueryParams): JobsQueryParams {
  const filters: JobsQueryParams = { ...defaults };

  if (query.per_page !== undefined) filters.per_page = Number(query.per_page);
  if (query.order_by !== undefined) filters.order_by = query.order_by;
  if (query.currency !== undefined) filters.currency = query.currency;
  if (query.salary !== undefined) filters.salary = Number(query.salary);
  if (query.period !== undefined) filters.period = query.period;
  if (query.employment_form !== undefined)
    if (query.area !== undefined) filters.area = parseStringArray(query.area);
  if (filters.experience !== undefined) filters.experience = parseStringArray(query.experience);
  if (filters.work_format !== undefined) filters.work_format = parseStringArray(query.work_format);
  if (filters.employment_form !== undefined)
    filters.employment_form = parseStringArray(query.employment_form);
  if (filters.label !== undefined) filters.label = parseStringArray(query.label);

  return filters;
}
