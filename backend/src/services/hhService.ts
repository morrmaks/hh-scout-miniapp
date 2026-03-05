import type { JobDTO } from '../dto/jobDto';
import type { SearchResultDTO } from '../dto/searchResultDto';
import type { VacancyFull, VacancyShort } from '../types/types';

import { inFlightSearch, inFlightVacancy, searchSessions, vacancyCache } from '../cache/hhCache';
import { toJobDTO } from '../dto/jobDto';
import { enqueue } from '../queue/queue';
import { fetchRetry } from '../utils/fetchRetry';
import { normalizeQuery } from '../utils/normalizeQuery';

export async function searchJobs(query: string, page: number): Promise<SearchResultDTO> {
  const normalized = normalizeQuery(query);
  const session = searchSessions.get(normalized);
  if (session && session.pages[page]) {
    prefetchVacancies(session.pages[page].slice(10, 20).map((j) => j.id));
    return { items: session.pages[page], page, pages: session.pagesTotal, found: session.found };
  }

  const key = `${query}_${page}`;
  const existing = inFlightSearch.get(key);
  if (existing) return existing;

  const promise = enqueue(async () => {
    const res = await fetchRetry(
      `https://api.hh.ru/vacancies?text=${encodeURIComponent(query)}&per_page=100&page=${page}`
    );
    const data = (await res.json()) as { items: VacancyShort[]; pages: number; found: number };
    const rawItems = data.items;
    const pages = data.pages;
    const found = data.found;

    const first10 = rawItems.slice(0, 10);
    const jobs: JobDTO[] = await Promise.all(first10.map((j) => getVacancyById(j.id)));

    const newSession = session ?? { pages: [], pagesTotal: pages, found };
    newSession.pages[page] = jobs;
    searchSessions.set(query, newSession);

    prefetchVacancies(rawItems.slice(10, 20).map((j) => j.id));

    return { items: jobs, page, pages, found };
  });

  inFlightSearch.set(key, promise);

  try {
    return await promise;
  } finally {
    inFlightSearch.delete(key);
  }
}

export async function getFullVacancy(id: string): Promise<VacancyFull> {
  const cached = vacancyCache.get(id);
  if (cached) return cached;

  const existing = inFlightVacancy.get(id);
  if (existing) return existing;

  const promise = enqueue(async () => {
    const res = await fetchRetry(`https://api.hh.ru/vacancies/${id}`);
    const data = await res.json();
    vacancyCache.set(id, data);
    return data;
  });

  inFlightVacancy.set(id, promise);

  try {
    return await promise;
  } finally {
    inFlightVacancy.delete(id);
  }
}

export async function getVacancyById(id: string): Promise<JobDTO> {
  const full = await getFullVacancy(id);
  return toJobDTO(full);
}

export async function prefetchVacancies(ids: string[]) {
  const safeIds = ids.slice(0, 10);
  await Promise.all(safeIds.map((id) => getFullVacancy(id).catch(() => {})));
}
