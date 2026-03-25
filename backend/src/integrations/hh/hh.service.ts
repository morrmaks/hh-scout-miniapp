import type { JobFilters } from '../../types/jobs.types';
import type { HHArea, HHSuggest, HHVacanciesResponse, HHVacancyFull } from './hh.types';

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

export async function getSuggestKeywords(text: string): Promise<HHSuggest> {
  const params = new URLSearchParams({ text });
  return hhFetch<HHSuggest>(`/suggests/vacancy_search_keyword?${params}`);
}
