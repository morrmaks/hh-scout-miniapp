import { cleanObject } from '@/common/utils/object';
import { hasQueryParams, parseNumber } from '@/common/utils/query';

import type {
  JobsFiltersKeys,
  JobsFiltersType,
  JobsPosition,
  JobsSearchState
} from '../types/types';

import { parseFilters } from './filters';

export function buildUrlQuery(
  query: string,
  page: number,
  index: number,
  filters: JobsFiltersType
) {
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
  filters: JobsFiltersType,
  restoreMode: boolean
) {
  return {
    text: query,
    page,
    ...cleanObject(filters),
    ...(restoreMode && index > 0 ? { index } : {})
  };
}

const FILTER_KEYS: readonly JobsFiltersKeys[] = [
  'area',
  'currency',
  'employment_form',
  'experience',
  'order_by',
  'per_page',
  'period',
  'salary',
  'work_format',
  'work_schedule_by_days'
];

const SEARCH_KEYS = ['text', 'page', 'index', ...FILTER_KEYS] as const;

function parseQuery(query: Record<string, unknown>, defaults: JobsFiltersType): JobsSearchState {
  return {
    query: String(query.text ?? ''),
    page: parseNumber(query.page, 1),
    index: parseNumber(query.index, 0),
    filters: parseFilters(query, defaults)
  };
}

export async function resolveSearchState(
  routeQuery: Record<string, unknown>,
  restorePosition: () => Promise<JobsPosition | null>,
  defaults: JobsFiltersType
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
