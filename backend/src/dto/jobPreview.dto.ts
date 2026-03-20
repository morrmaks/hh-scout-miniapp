import type { HHVacancyShort } from '../integrations/hh';

export interface JobPreviewDTO {
  company: string;
  id: string;
  title: string;
  url: string;
}

export function toJobPreviewDTO(job: HHVacancyShort): JobPreviewDTO {
  return {
    id: job.id,
    title: job.name,
    company: job.employer?.name ?? 'Unknown',
    url: job.alternate_url
  };
}
