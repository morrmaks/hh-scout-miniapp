import { dbDelete, dbGet, dbSet } from '@/common/lib/indexedDb';

const KEY = 'active-resume-id';

export function useActiveResume() {
  function save(id: number | null) {
    if (id === null) return dbDelete(KEY);

    return dbSet(KEY, id);
  }

  function restore(): Promise<number | null> {
    return dbGet<number>(KEY);
  }

  function remove() {
    return dbDelete(KEY);
  }

  return {
    save,
    restore,
    remove
  };
}
