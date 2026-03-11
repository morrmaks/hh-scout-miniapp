import type { HHVacancyShort } from '../integrations/hh';

export interface SearchSession {
  found: number;
  pages: HHVacancyShort[][];
  pagesTotal: number;
  perPage: number;
}

export interface JobFilters {
  area?: string[];
  currency?: string;
  employment_form?: string[];
  experience?: string[];
  index?: number;
  label?: string[];
  order_by?: string;
  page?: number;
  per_page?: number;
  period?: number;
  salary?: number;
  text?: string;
  work_format?: string[];
}
