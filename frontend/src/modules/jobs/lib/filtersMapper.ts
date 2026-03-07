import type { JobFilters } from '../types/jobsFilters';

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

export function toLocalFilters(filters: JobFilters): LocalFilters {
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

export function toApiFilters(local: LocalFilters): JobFilters {
  return {
    per_page: local.per_page,
    order_by: local.order_by,
    salary: local.salary,

    experience: local.experience ?? undefined,

    employment_form:
      local.employment_form && local.employment_form.length ? local.employment_form : undefined,

    work_format: local.work_format && local.work_format.length ? local.work_format : undefined,
    work_schedule_by_days:
      local.work_schedule_by_days && local.work_schedule_by_days.length
        ? local.work_schedule_by_days
        : undefined,

    area: local.area?.length ? local.area : undefined,

    period: local.period ?? undefined
  };
}
