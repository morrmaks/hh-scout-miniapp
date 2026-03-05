import type { SearchResultDTO } from '../dto/searchResultDto';
import type { SearchSession, VacancyFull } from '../types/types';

import { LRU } from './lru';

export const searchSessions = new LRU<string, SearchSession>(50, 10 * 60 * 1000);
export const vacancyCache = new LRU<string, VacancyFull>(500, 10 * 60 * 60 * 1000);

export const inFlightVacancy = new Map<string, Promise<VacancyFull>>();
export const inFlightSearch = new Map<string, Promise<SearchResultDTO>>();
