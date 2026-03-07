import { dbGet, dbSet } from '@/common/lib/indexedDb';

const KEY = 'jobs-position';

interface JobsPosition {
  index: number;
  page: number;
  query: string;
}

export function useJobsPosition() {
  async function save(query: string, page: number, index: number) {
    await dbSet<JobsPosition>(KEY, { query, page, index });
  }

  async function restore(): Promise<JobsPosition | null> {
    return await dbGet<JobsPosition>(KEY);
  }

  return {
    save,
    restore
  };
}
