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
  area?: {
    id: string;
    name: string;
  };
  description: string;
  employer?: {
    name: string;
  };

  employment?: {
    id: string;
    name: string;
  };

  experience?: {
    id: string;
    name: string;
  };

  id: string;

  key_skills?: {
    name: string;
  }[];

  name: string;

  salary?: {
    from?: number;
    to?: number;
    currency?: string;
  };

  schedule?: {
    id: string;
    name: string;
  };

  work_format?: {
    id: string;
    name: string;
  };

  working_hours?: {
    id: string;
    name: string;
  };
}

export interface SearchSession {
  found: number;
  pages: VacancyShort[][];
  pagesTotal: number;
  perPage: number;
}

export interface JobFilters {
  area?: string[];
  currency?: string;
  employment_form?: string[];
  experience?: string[];
  label?: string[];
  order_by?: string;
  page?: number;
  per_page?: number;
  period?: number;
  salary?: number;
  text?: string;
  work_format?: string[];
  work_schedule_by_days?: string[];
}
