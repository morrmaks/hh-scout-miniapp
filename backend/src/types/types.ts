import type { JobDTO } from '../dto/jobDto';

export interface VacancyShort {
  alternate_url: string;
  employer?: {
    name: string;
  };
  id: string;
  name: string;
}

export interface VacancyFull {
  alternate_url: string;
  description: string;
  employer?: {
    name: string;
  };
  id: string;
  name: string;
}

export interface SearchSession {
  found: number;
  pages: JobDTO[][];
  pagesTotal: number;
}
