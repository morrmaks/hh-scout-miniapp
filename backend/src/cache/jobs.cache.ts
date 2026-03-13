import type { SearchResultDTO } from '../dto/searchResult.dto';
import type { HHVacancyFull } from '../integrations/hh';
import type { SearchSession } from '../types/jobs.types';

import { LRU } from './lru';

export const searchSessions = new LRU<string, SearchSession>(50, 10 * 60 * 1000);
export const vacancyCache = new LRU<string, HHVacancyFull>(500, 10 * 60 * 60 * 1000);

export const inFlightVacancy = new Map<string, Promise<HHVacancyFull>>();
export const inFlightSearch = new Map<string, Promise<SearchResultDTO>>();
