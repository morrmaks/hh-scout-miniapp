import type { VacancyFull } from '../types/types';

import { formatDescription } from '../utils/format';

export interface JobDTO {
  city?: string;
  company: string;
  currency?: string;
  description: string;

  employment?: string;

  experience?: string;
  id: string;
  salaryFrom?: number;

  salaryTo?: number;
  schedule?: string;
  skills: string[];
  title: string;
  url: string;

  workFormat?: string;

  workingHours?: string;
}
export function toJobDTO(job: VacancyFull): JobDTO {
  return {
    id: job.id,

    title: job.name,

    company: job.employer?.name ?? 'Unknown',

    url: job.alternate_url,

    description: formatDescription(job.description),

    salaryFrom: job.salary?.from,
    salaryTo: job.salary?.to,
    currency: job.salary?.currency,

    experience: job.experience?.name,
    schedule: job.schedule?.name,
    employment: job.employment?.name,
    workFormat: job.work_format?.name,
    workingHours: job.working_hours?.name,

    city: job.area?.name,

    skills: job.key_skills?.map((s) => s.name) ?? []
  };
}
