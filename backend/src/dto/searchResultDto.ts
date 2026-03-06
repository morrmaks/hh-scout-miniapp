import type { JobDTO } from './jobDto';

export interface SearchResultDTO {
  found: number;
  items: JobDTO[];
  page: number;
  pageItems: number;
  pages: number;
  perPage: number;
}
