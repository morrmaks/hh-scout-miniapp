export interface HHVacancyShort {
  alternate_url: string;
  employer?: {
    name: string;
  };
  id: string;

  name: string;
}

export interface HHVacancyFull {
  alternate_url: string;
  area?: {
    id: string;
    name: string;
  };
  description: string;
  employer?: {
    name: string;
  };

  employment_form?: {
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

  published_at: string;

  salary?: {
    from?: number;
    to?: number;
    currency?: string;
  };

  work_format?: {
    id: string;
    name: string;
  }[];

  work_schedule_by_days?: {
    id: string;
    name: string;
  }[];

  working_hours?: {
    id: string;
    name: string;
  }[];
}

export interface HHVacanciesResponse {
  found: number;
  items: HHVacancyShort[];
  pages: number;
  per_page: number;
}

export interface HHArea {
  areas: HHArea[];
  id: string;
  name: string;
}
