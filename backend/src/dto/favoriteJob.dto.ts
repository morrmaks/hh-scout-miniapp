import type { HHCurrency } from '../integrations/hh';
import type { JobDTO } from './job.dto';

export interface FavoriteJobDTO {
  company: string;

  currency?: HHCurrency;
  experience?: string;
  id: string;

  publishedAt?: Date;
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
    url: job.url,

    salaryFrom: job.salaryFrom,
    salaryTo: job.salaryTo,
    currency: job.currency,

    experience: job.experience,

    publishedAt: job.publishedAt ? new Date(job.publishedAt) : undefined
  };
}
