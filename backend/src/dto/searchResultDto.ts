import type { JobDTO } from './jobDto';

export interface SearchResultDTO {
  found: number;
  items: JobDTO[];
  page: number;
  pages: number;
  perPage: number;
}
