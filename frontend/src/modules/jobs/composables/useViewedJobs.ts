import { ref } from 'vue';

import { dbGet, dbSet } from '@/common/lib/indexedDb';

const KEY = 'viewed-jobs';

const viewed = ref<Set<string>>(new Set());

let loaded = false;

async function load() {
  if (loaded) return;

  const data = await dbGet<string[]>(KEY);

  viewed.value = new Set(data ?? []);

  loaded = true;
}

async function save() {
  await dbSet(KEY, [...viewed.value]);
}

export function useViewedJobs() {
  load();

  function markViewed(id: string) {
    if (viewed.value.has(id)) return;

    viewed.value.add(id);
    save();
  }

  function isViewed(id: string) {
    return viewed.value.has(id);
  }

  return {
    viewed,
    markViewed,
    isViewed
  };
}
