import type { SearchJobsData } from '@/common/api/generated';

import { cleanObject } from '@/common/utils/object';
import { hasQueryParams, parseNumber } from '@/common/utils/query';

import type {
  JobsPosition,
  JobsQueryParams,
  JobsQueryParamsKeys,
  JobsSearchState
} from '../types/jobs.types';

import { parseFilters } from './filters';

export function buildUrlQuery(
  query: string,
  page: number,
  index: number,
  filters: JobsQueryParams
): SearchJobsData['query'] {
  return {
    text: query,
    page,
    ...(index > 0 ? { index } : {}),
    ...cleanObject(filters)
  };
}

export function buildApiQuery(
  query: string,
  page: number,
  index: number,
  filters: JobsQueryParams,
  restoreMode: boolean
) {
  return {
    text: query,
    page,
    ...cleanObject(filters),
    ...(restoreMode && index > 0 ? { index } : {})
  };
}

const FILTER_KEYS: readonly JobsQueryParamsKeys[] = [
  'area',
  'employment_form',
  'experience',
  'order_by',
  'per_page',
  'period',
  'currency',
  'salary',
  'label',
  'work_format'
];

const SEARCH_KEYS = ['text', 'page', 'index', ...FILTER_KEYS] as const;

function parseQuery(query: JobsQueryParams, defaults: JobsQueryParams): JobsSearchState {
  return {
    query: String(query.text ?? ''),
    page: parseNumber(query.page, 1),
    index: parseNumber(query.index, 0),
    filters: parseFilters(query, defaults)
  };
}

export async function resolveSearchState(
  routeQuery: JobsQueryParams,
  restorePosition: () => Promise<JobsPosition | null>,
  defaults: JobsQueryParams
): Promise<JobsSearchState | null> {
  if (hasQueryParams(routeQuery, SEARCH_KEYS)) return parseQuery(routeQuery, defaults);

  const saved = await restorePosition();

  if (saved) {
    return {
      query: saved.query ?? '',
      page: saved.page ?? 1,
      index: saved.index ?? 0,
      filters: {
        ...defaults,
        ...(saved.filters ?? {})
      }
    };
  }

  return null;
}
