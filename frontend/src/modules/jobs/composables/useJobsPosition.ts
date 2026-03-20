import type { JobsOrderBy } from '@/common/api/generated';

import { dbGet, dbSet } from '@/common/lib/indexedDb';

import type { JobsFiltersType, JobsPosition } from '../types/jobs.types';

const KEY = 'jobs-position';

export function useJobsPosition() {
  function save(
    query: string,
    page: number,
    index: number,
    orderBy: JobsOrderBy,
    perPage: number,
    filters: JobsFiltersType
  ) {
    return dbSet(KEY, {
      query,
      page,
      index,
      orderBy,
      perPage,
      filters: JSON.parse(JSON.stringify(filters))
    });
  }

  function restore(): Promise<JobsPosition | null> {
    return dbGet<JobsPosition>(KEY);
  }

  return {
    save,
    restore
  };
}
