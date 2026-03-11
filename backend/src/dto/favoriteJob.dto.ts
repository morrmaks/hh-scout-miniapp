import type { JobDTO } from './job.dto';

export interface FavoriteJobDTO {
  company: string;
  currency?: string;
  experience?: string;

  id: string;
  salaryFrom?: number;
  salaryTo?: number;

  title: string;

  url: string;
}

export function toFavoriteJob(job: JobDTO): FavoriteJobDTO {
  return {
    id: job.id,

    title: job.title,

    company: job.company,

    salaryFrom: job.salaryFrom,
    salaryTo: job.salaryTo,
    currency: job.currency,

    experience: job.experience,

    url: job.url
  };
}
