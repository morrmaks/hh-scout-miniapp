import type { JobDTO } from './job.dto';

export interface SearchResultDTO {
  found: number;
  items: JobDTO[];
  page: number;
  pageItems: number;
  pages: number;
  perPage: number;
}
