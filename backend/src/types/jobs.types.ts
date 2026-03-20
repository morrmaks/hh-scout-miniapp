import type { HHVacancyShort } from '../integrations/hh';

export type JobLabel = 'with_salary';
export type JobsCurrency = 'EUR' | 'RUR' | 'USD';

export interface SearchSession {
  found: number;
  pages: HHVacancyShort[][];
  pagesTotal: number;
  perPage: number;
}

export interface JobFilters {
  area?: string[];
  currency?: JobsCurrency;
  employment_form?: string[];
  experience?: string[];
  index?: number;
  label?: JobLabel[];
  order_by?: string;
  page?: number;
  per_page?: number;
  period?: string;
  salary?: number;
  text?: string;
  work_format?: string[];
}
