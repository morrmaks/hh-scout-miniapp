import type { JobFilters } from '../types/jobsFilters';

export interface LocalFilters {
  area?: string[];

  employment_form?: string[];
  experience?: string;

  order_by?: string;
  period?: number;
  salary?: number;
  work_format?: string[];
}

export function toLocalFilters(filters: JobFilters): LocalFilters {
  return {
    order_by: filters.order_by,
    salary: filters.salary,

    experience: filters.experience?.[0],

    employment_form: filters.employment_form ?? [],
    work_format: filters.work_format ?? [],

    area: filters.area ?? [],

    period: filters.period
  };
}

export function toApiFilters(local: LocalFilters): JobFilters {
  return {
    order_by: local.order_by,
    salary: local.salary,

    experience: local.experience ? [local.experience] : undefined,

    employment_form:
      local.employment_form && local.employment_form.length ? local.employment_form : undefined,

    work_format: local.work_format && local.work_format.length ? local.work_format : undefined,

    area: local.area?.length ? local.area : undefined,

    period: local.period
  };
}
