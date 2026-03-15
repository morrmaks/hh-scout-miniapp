import type { ParsedQs } from 'qs';

import type { JobFilters, JobLabel, JobsCurrency } from '../types/jobs.types';

const CURRENCIES = ['EUR', 'RUR', 'USD'] as const;
const LABELS = ['with_salary'] as const;

function toCurrency(value: unknown): JobsCurrency | undefined {
  if (!value) return undefined;

  const v = String(value);
  return CURRENCIES.includes(v as JobsCurrency) ? (v as JobsCurrency) : undefined;
}

function toLabels(value: unknown): JobLabel[] | undefined {
  const arr = toArray(value);
  if (!arr) return undefined;

  return arr.filter((v): v is JobLabel => LABELS.includes(v as JobLabel));
}

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

const MAX_RESULTS = 2000;

export function parseJobFilters(query: ParsedQs): JobFilters {
  const perPage = Math.min(toNumber(query.per_page) ?? 100, 100);
  const maxPageIndex = Math.floor(MAX_RESULTS / perPage) - 1;

  const pageRaw = toNumber(query.page);
  const pageIndex = pageRaw === undefined ? 0 : Math.min(Math.max(pageRaw - 1, 0), maxPageIndex);

  return {
    text: query.text ? String(query.text) : undefined,

    page: pageIndex,
    index: toNumber(query.index),

    per_page: perPage,
    order_by: query.order_by ? String(query.order_by) : undefined,

    salary: toNumber(query.salary),
    currency: toCurrency(query.currency),

    experience: toArray(query.experience),
    employment_form: toArray(query.employment_form),
    work_format: toArray(query.work_format),
    area: toArray(query.area),

    label: toLabels(query.label),
    period: toNumber(query.period)
  };
}
