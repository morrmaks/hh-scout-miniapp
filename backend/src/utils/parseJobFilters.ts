import type { ParsedQs } from 'qs';

import type { JobFilters } from '../types/types';

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function toArray(value: unknown): string[] | undefined {
  if (!value) return undefined;

  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

export function parseJobFilters(query: ParsedQs): JobFilters {
  const pageRaw = toNumber(query.page);

  const page = pageRaw === undefined ? 1 : Math.min(Math.max(pageRaw, 1), 20);

  return {
    text: query.q ? String(query.q) : undefined,
    page,
    per_page: toNumber(query.per_page),
    order_by: query.order_by ? String(query.order_by) : undefined,
    salary: toNumber(query.salary),
    currency: query.currency ? String(query.currency) : undefined,

    experience: toArray(query.experience),
    employment_form: toArray(query.employment_form),
    work_format: toArray(query.work_format),
    work_schedule_by_days: toArray(query.work_schedule_by_days),
    area: toArray(query.area),
    label: toArray(query.label),
    period: toNumber(query.period)
  };
}
