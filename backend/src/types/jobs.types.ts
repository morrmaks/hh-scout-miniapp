import type { HHVacancyShort } from '../integrations/hh';

export type JobLabel = 'with_salary';
export type Currency = 'EUR' | 'RUR' | 'USD';

export interface SearchSession {
  found: number;
  pages: HHVacancyShort[][];
  pagesTotal: number;
  perPage: number;
}

export interface JobFilters {
  area?: string[];
  currency?: Currency;
  employment_form?: string[];
  experience?: string[];
  index?: number;
  label?: JobLabel | JobLabel[];
  order_by?: string;
  page?: number;
  per_page?: number;
  period?: number;
  salary?: number;
  text?: string;
  work_format?: string[];
}
