import type { SearchJobsData } from '@/common/api/generated';

import { cleanObject } from '@/common/utils/object';
import { hasQueryParams, parseNumber } from '@/common/utils/query';

import type {
  JobsFiltersType,
  JobsPosition,
  JobsQueryParams,
  JobsQueryParamsKeys,
  JobsSearchState
} from '../types/jobs.types';

import { parseFilters } from '../filters';

export function buildUrlQuery(query: JobsQueryParams): SearchJobsData['query'] {
  return cleanObject(query);
}

export function buildApiQuery(query: JobsQueryParams): JobsQueryParams {
  return cleanObject(query);
}

const FILTER_KEYS: readonly JobsQueryParamsKeys[] = [
  'area',
  'employment_form',
  'experience',
  'period',
  'currency',
  'salary',
  'label',
  'work_format'
];

const SEARCH_KEYS = ['text', 'page', 'index', 'order_by', 'per_page', ...FILTER_KEYS] as const;

function parseQuery(query: JobsQueryParams, defaults: JobsFiltersType): JobsSearchState {
  return {
    query: String(query.text ?? ''),
    page: parseNumber(query.page, 1),
    index: parseNumber(query.index, 0),
    filters: parseFilters(query, defaults),
    orderBy: query.order_by ?? 'relevance',
    perPage: parseNumber(query.per_page, 100)
  };
}

export async function resolveSearchState(
  routeQuery: JobsQueryParams,
  restorePosition: () => Promise<JobsPosition | null>,
  defaults: JobsFiltersType
): Promise<JobsSearchState | null> {
  if (hasQueryParams(routeQuery, SEARCH_KEYS)) return parseQuery(routeQuery, defaults);

  const saved = await restorePosition();

  if (saved)
    return {
      query: saved.query ?? '',
      page: saved.page ?? 1,
      index: saved.index ?? 0,
      filters: {
        ...defaults,
        ...(saved.filters ?? {})
      },
      orderBy: saved.orderBy ?? 'relevance',
      perPage: saved.perPage ?? 100
    };

  return null;
}
