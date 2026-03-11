import type { SearchJobsData } from '@/common/api/generated';

export type JobsQueryParams = NonNullable<SearchJobsData['query']>;
export type JobsQueryParamsKeys = keyof JobsQueryParams;

export type JobsFilters = Omit<JobsQueryParams, 'index' | 'page' | 'text'>;

export interface JobsPosition {
  filters: JobsFilters;
  index: number;
  page: number;
  query: string;
}

export interface JobsSearchState {
  filters: JobsFilters;
  index: number;
  page: number;
  query: string;
}
