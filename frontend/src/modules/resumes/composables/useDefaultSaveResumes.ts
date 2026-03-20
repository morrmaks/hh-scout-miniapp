import { dbDelete, dbGet, dbSet } from '@/common/lib/indexedDb';

const KEY = 'default-save-resumes';

export function useDefaultSaveResumes() {
  function save(ids: number[]) {
    return dbSet(KEY, [...ids]);
  }

  function restore(): Promise<number[] | null> {
    return dbGet<number[]>(KEY);
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
