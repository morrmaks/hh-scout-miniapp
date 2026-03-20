import type { JobFilters } from '../../types/jobs.types';
import type { HHArea, HHVacanciesResponse, HHVacancyFull } from './hh.types';

import { hhFetch } from './hh.client';
import { buildSearchParams } from './hh.helpers';

export async function getVacancyById(id: string) {
  return hhFetch<HHVacancyFull>(`/vacancies/${id}`);
}

export async function getVacancies(filters: JobFilters): Promise<HHVacanciesResponse> {
  const params = buildSearchParams(filters);
  return hhFetch<HHVacanciesResponse>(`/vacancies?${params.toString()}`);
}

export async function getAreas(): Promise<HHArea[]> {
  return hhFetch<HHArea[]>(`/areas`);
}
