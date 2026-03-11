import { dbGet, dbSet } from '@/common/lib/indexedDb';

import type { JobsFiltersType } from '../types/jobs.types';

const KEY = 'jobs-position';

interface JobsPosition {
  filters: JobsFiltersType;
  index: number;
  page: number;
  query: string;
}

export function useJobsPosition() {
  function save(query: string, page: number, index: number, filters: JobsFiltersType) {
    return dbSet(KEY, { query, page, index, filters: JSON.parse(JSON.stringify(filters)) });
  }

  function restore(): Promise<JobsPosition | null> {
    return dbGet<JobsPosition>(KEY);
  }

  return {
    save,
    restore
  };
}
