import type { VacancyFull } from '../types/types';

import { formatDescription } from '../utils/format';

export interface JobDTO {
  company: string;
  description: string;
  id: string;
  title: string;
  url: string;
}

export function toJobDTO(job: VacancyFull): JobDTO {
  return {
    id: job.id,
    title: job.name,
    company: job.employer?.name ?? 'Unknown',
    url: job.alternate_url,
    description: formatDescription(job.description)
  };
}
