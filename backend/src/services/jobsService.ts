import type { SearchResultDTO } from '../dto/searchResultDto';
import type { JobFilters, VacancyShort } from '../types/types';

import { inFlightSearch, inFlightVacancy, searchSessions, vacancyCache } from '../cache/jobsCache';
import { toJobDTO } from '../dto/jobDto';
import { enqueue } from '../queue/queue';
import { buildHHUrl } from '../utils/buildHHUrl';
import { buildSearchKey } from '../utils/buildSearchKey';
import { fetchRetry } from '../utils/fetchRetry';

const STEP = 10;

export async function searchJobs(filters: JobFilters): Promise<SearchResultDTO> {
  const page = filters.page ?? 1;

  const searchKey = buildSearchKey({
    ...filters,
    page: undefined
  });

  const session = searchSessions.get(searchKey);

  if (session && session.pages[page]) {
    const raw = session.pages[page];
    const first = raw.slice(0, STEP);

    const jobs = await Promise.all(first.map((v) => getVacancyById(v.id)));

    return {
      items: jobs,
      page,
      pages: session.pagesTotal,
      found: session.found,
      perPage: session.perPage
    };
  }

  const requestKey = `${searchKey}_${page}`;

  const existing = inFlightSearch.get(requestKey);
  if (existing) return existing;

  const promise = enqueue(async () => {
    const url = buildHHUrl(filters);

    const res = await fetchRetry(url);

    const data = (await res.json()) as {
      items: VacancyShort[];
      pages: number;
      found: number;
      per_page: number;
    };

    let newSession = session;

    if (!newSession) {
      newSession = {
        pages: [],
        pagesTotal: data.pages,
        found: data.found,
        perPage: data.per_page
      };
    }

    if (!newSession.pages[page]) {
      newSession.pages[page] = data.items;
    }

    searchSessions.set(searchKey, newSession);

    const first = data.items.slice(0, STEP);

    const jobs = await Promise.all(first.map((v) => getVacancyById(v.id)));

    return {
      items: jobs,
      page,
      pages: data.pages,
      found: data.found,
      perPage: data.per_page
    };
  });

  inFlightSearch.set(requestKey, promise);

  try {
    return await promise;
  } finally {
    inFlightSearch.delete(requestKey);
  }
}

export async function prefetchVacancies(filters: JobFilters & { index: number }) {
  const page = filters.page ?? 1;

  const searchKey = buildSearchKey({
    ...filters,
    page: undefined
  });

  const session = searchSessions.get(searchKey);
  if (!session) return { items: [] };

  const raw = session.pages[page];
  if (!raw) return { items: [] };

  const offset = Math.floor(filters.index / STEP) * STEP + STEP;

  if (offset >= raw.length) return { items: [] };

  const slice = raw.slice(offset, offset + STEP);

  const jobs = await Promise.all(slice.map((v) => getVacancyById(v.id)));

  return { items: jobs };
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
