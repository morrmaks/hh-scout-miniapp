import type { JobsOrderBy, SearchJobsData } from '@/common/api/generated';

export type JobsQueryParams = NonNullable<SearchJobsData['query']>;
export type JobsQueryParamsKeys = keyof JobsQueryParams;

export type JobsFiltersType = Omit<
  JobsQueryParams,
  'index' | 'order_by' | 'page' | 'per_page' | 'text'
>;

export interface JobsPosition {
  filters: JobsFiltersType;
  index: number;
  orderBy: JobsOrderBy;
  page: number;
  perPage: number;
  query: string;
}

export interface JobsSearchState {
  filters: JobsFiltersType;
  index: number;
  orderBy: JobsOrderBy;
  page: number;
  perPage: number;
  query: string;
}
