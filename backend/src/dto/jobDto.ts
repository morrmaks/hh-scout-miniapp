import type { VacancyFull } from '../types/types';

import { formatDescription } from '../utils/format';
import { formatJobDate } from '../utils/formatJobDate';
import { mapNames } from '../utils/mapNames';

export interface JobDTO {
  city?: string;
  company: string;
  currency?: string;
  description: string;
  employmentForm?: string;
  experience?: string;
  id: string;
  publishedAt: string;
  salaryFrom?: number;
  salaryTo?: number;
  skills: string[];
  title: string;
  url: string;
  workFormat?: string[];
  workingHours?: string[];
  workSchedule?: string[];
}

export function toJobDTO(job: VacancyFull): JobDTO {
  return {
    id: job.id,
    title: job.name,
    company: job.employer?.name ?? 'Unknown',
    url: job.alternate_url,
    description: formatDescription(job.description),
    publishedAt: formatJobDate(job.published_at),
    salaryFrom: job.salary?.from,
    salaryTo: job.salary?.to,
    currency: job.salary?.currency,
    experience: job.experience?.name,
    employmentForm: job.employment_form?.name,
    workFormat: mapNames(job.work_format),
    workSchedule: mapNames(job.work_schedule_by_days),
    workingHours: mapNames(job.working_hours),
    city: job.area?.name,
    skills: job.key_skills?.map((s) => s.name) ?? []
  };
}
