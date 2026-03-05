import type { SearchResultDTO } from '../dto/searchResultDto';
import type { VacancyShort } from '../types/types';

import { inFlightSearch, inFlightVacancy, searchSessions, vacancyCache } from '../cache/jobsCache';
import { toJobDTO } from '../dto/jobDto';
import { enqueue } from '../queue/queue';
import { fetchRetry } from '../utils/fetchRetry';
import { normalizeQuery } from '../utils/normalizeQuery';

const PAGE_SIZE = 10;

export async function searchJobs(query: string, page: number): Promise<SearchResultDTO> {
  const normalized = normalizeQuery(query);

  const session = searchSessions.get(normalized);
  if (session && session.pages[page]) {
    const raw = session.pages[page];
    const first10 = raw.slice(0, PAGE_SIZE);

    const jobs = await Promise.all(first10.map((v) => getVacancyById(v.id)));

    return {
      items: jobs,
      page,
      pages: session.pagesTotal,
      found: session.found,
      perPage: session.perPage
    };
  }

  const key = `${normalized}_${page}`;

  const existing = inFlightSearch.get(key);
  if (existing) return existing;

  const promise = enqueue(async () => {
    const res = await fetchRetry(
      `https://api.hh.ru/vacancies?text=${encodeURIComponent(query)}&per_page=100&page=${page - 1}`
    );

    const data = (await res.json()) as {
      items: VacancyShort[];
      pages: number;
      found: number;
      per_page: number;
    };

    const rawItems = data.items;

    let newSession = session;

    if (!newSession) {
      newSession = {
        pages: [],
        pagesTotal: data.pages,
        found: data.found,
        perPage: data.per_page
      };
    }

    newSession.pages[page] = rawItems;
    searchSessions.set(normalized, newSession);

    const jobs = await Promise.all(rawItems.slice(0, PAGE_SIZE).map((v) => getVacancyById(v.id)));

    return {
      items: jobs,
      page,
      pages: newSession.pagesTotal,
      found: newSession.found,
      perPage: newSession.perPage
    };
  });

  inFlightSearch.set(key, promise);

  try {
    return await promise;
  } finally {
    inFlightSearch.delete(key);
  }
}

export async function getVacancyById(id: string) {
  const cached = vacancyCache.get(id);
  if (cached) return toJobDTO(cached);

  const existing = inFlightVacancy.get(id);

  if (existing) {
    const full = await existing;
    return toJobDTO(full);
  }

  const promise = enqueue(async () => {
    const res = await fetchRetry(`https://api.hh.ru/vacancies/${id}`);
    const data = await res.json();
    vacancyCache.set(id, data);
    return data;
  });

  inFlightVacancy.set(id, promise);

  try {
    const full = await promise;
    return toJobDTO(full);
  } finally {
    inFlightVacancy.delete(id);
  }
}

export async function prefetchVacancies(query: string, page: number, index: number) {
  const normalized = normalizeQuery(query);

  const session = searchSessions.get(normalized);
  if (!session) return { items: [] };

  const raw = session.pages[page];
  if (!raw) return { items: [] };

  const offset = Math.floor(index / PAGE_SIZE) * PAGE_SIZE + PAGE_SIZE;
  const slice = raw.slice(offset, offset + PAGE_SIZE);

  const jobs = await Promise.all(slice.map((v) => getVacancyById(v.id)));

  return { items: jobs };
}
