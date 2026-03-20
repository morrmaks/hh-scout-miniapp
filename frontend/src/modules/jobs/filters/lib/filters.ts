import { parseStringArray } from '@/common/utils/query';

import type { JobsFiltersType, JobsQueryParams } from '../../types/jobs.types';

export function parseFilters(query: JobsQueryParams, defaults: JobsFiltersType): JobsFiltersType {
  const filters: JobsFiltersType = { ...defaults };

  if (query.currency !== undefined) filters.currency = query.currency;

  if (query.salary !== undefined) filters.salary = Number(query.salary);

  if (query.period !== undefined) filters.period = query.period;

  if (query.area !== undefined) filters.area = parseStringArray(query.area);

  if (query.experience !== undefined) filters.experience = parseStringArray(query.experience);

  if (query.work_format !== undefined) filters.work_format = parseStringArray(query.work_format);

  if (query.employment_form !== undefined)
    filters.employment_form = parseStringArray(query.employment_form);

  if (query.label !== undefined) filters.label = parseStringArray(query.label);

  return filters;
}
