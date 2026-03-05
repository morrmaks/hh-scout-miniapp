import type { VacancyShort } from '../types/types';

export interface JobPreviewDTO {
  company: string;
  id: string;
  title: string;
  url: string;
}

export function toJobPreviewDTO(job: VacancyShort): JobPreviewDTO {
  return {
    id: job.id,
    title: job.name,
    company: job.employer?.name ?? 'Unknown',
    url: job.alternate_url
  };
}
