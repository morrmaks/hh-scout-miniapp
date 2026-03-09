export interface JobsFiltersType {
  area?: string[];
  currency?: string;
  employment_form?: string[];
  experience?: string;
  order_by?: string;
  per_page?: number;
  period?: number;
  salary?: number;
  work_format?: string[];
  work_schedule_by_days?: string[];
}
export type JobsFiltersKeys = keyof JobsFiltersType;

export interface JobsPosition {
  filters: JobsFiltersType;
  index: number;
  page: number;
  query: string;
}

export interface JobsSearchState {
  filters: JobsFiltersType;
  index: number;
  page: number;
  query: string;
}
