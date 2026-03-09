import type { SearchResultDTO } from '../dto/searchResultDto';
import type { JobFilters, VacancyShort } from '../types/types';

import { inFlightSearch, inFlightVacancy, searchSessions, vacancyCache } from '../cache/jobsCache';
import { toJobDTO } from '../dto/jobDto';
import { enqueue } from '../queue/queue';
import { buildHHUrl } from '../utils/buildHHUrl';
import { buildSearchKey } from '../utils/buildSearchKey';
import { fetchRetry } from '../utils/fetchRetry';

const STEP = 10;
const PREFETCH_TRIGGER = 7;

function calcRestoreLimit(index: number) {
  const base = Math.ceil((index + 1) / STEP) * STEP;

  const needExtra = index % STEP >= PREFETCH_TRIGGER - 1;

  return needExtra ? base + STEP : base;
}

async function loadVacancies(slice: VacancyShort[]) {
  return Promise.all(slice.map((v) => getVacancyById(v.id)));
}

export async function searchJobs(filters: JobFilters): Promise<SearchResultDTO> {
  const pageIndex = filters.page ?? 0;
  const page = pageIndex + 1;

  const index = filters.index;

  const searchKey = buildSearchKey(filters);

  const session = searchSessions.get(searchKey);

  if (session && session.pages[pageIndex]) {
    const raw = session.pages[pageIndex];

    const limit = typeof index === 'number' ? Math.min(calcRestoreLimit(index), raw.length) : STEP;

    const slice = raw.slice(0, limit);

    const jobs = await loadVacancies(slice);

    return {
      items: jobs,
      page,
      pages: session.pagesTotal,
      found: session.found,
      perPage: session.perPage,
      pageItems: raw.length
    };
  }

  const requestKey = `${searchKey}_${pageIndex}`;

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

    if (!newSession.pages[pageIndex]) newSession.pages[pageIndex] = data.items;

    searchSessions.set(searchKey, newSession);

    const raw = data.items;

    const limit = typeof index === 'number' ? Math.min(calcRestoreLimit(index), raw.length) : STEP;

    const slice = raw.slice(0, limit);

    const jobs = await loadVacancies(slice);

    return {
      items: jobs,
      page,
      pages: data.pages,
      found: data.found,
      perPage: data.per_page,
      pageItems: raw.length
    };
  });

  inFlightSearch.set(requestKey, promise);

  try {
    return await promise;
  } finally {
    inFlightSearch.delete(requestKey);
  }
}

export async function prefetchVacancies(filters: JobFilters) {
  const pageIndex = filters.page ?? 0;

  const index = filters.index ?? 0;

  const searchKey = buildSearchKey(filters);

  const session = searchSessions.get(searchKey);

  if (!session) return { items: [] };

  const raw = session.pages[pageIndex];

  if (!raw) return { items: [] };

  const offset = Math.floor(index / STEP) * STEP + STEP;

  if (offset >= raw.length) return { items: [] };

  const slice = raw.slice(offset, offset + STEP);

  const jobs = await loadVacancies(slice);

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
