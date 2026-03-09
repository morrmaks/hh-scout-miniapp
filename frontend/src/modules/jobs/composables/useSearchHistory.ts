import { ref } from 'vue';

import { dbGet, dbSet } from '@/common/lib/indexedDb';

const KEY = 'jobs-search-history';
const LIMIT = 8;

const history = ref<string[]>([]);

let ready: Promise<void> | null = null;

function init() {
  if (!ready) {
    ready = dbGet<string[]>(KEY).then((data) => {
      history.value = data ?? [];
    });
  }

  return ready;
}

function persist() {
  return dbSet(KEY, [...history.value]);
}

async function ensure() {
  await init();
}

export function useSearchHistory() {
  init();

  async function add(query: string) {
    await ensure();

    const q = query.trim();
    if (!q) return;

    history.value = [q, ...history.value.filter((v) => v !== q)].slice(0, LIMIT);

    return persist();
  }

  async function remove(query: string) {
    await ensure();

    history.value = history.value.filter((v) => v !== query);

    return persist();
  }

  async function clear() {
    await ensure();

    history.value = [];

    return persist();
  }

  return {
    history,
    add,
    remove,
    clear
  };
}
