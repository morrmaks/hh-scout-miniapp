import type { SearchJobsData } from '@/common/api/generated';

export type JobsFiltersType = NonNullable<SearchJobsData['query']>;
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
