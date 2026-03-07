import { ref } from 'vue';

import { dbGet, dbSet } from '@/common/lib/indexedDb';

const KEY = 'jobs-search-history';
const LIMIT = 8;

const history = ref<string[]>([]);

let ready: Promise<void> | null = null;

function init() {
  if (!ready) {
    ready = (async () => {
      const data = await dbGet<string[]>(KEY);
      history.value = data ?? [];
    })();
  }

  return ready;
}

async function persist() {
  // важно: сохраняем обычный массив, не Proxy
  await dbSet(KEY, [...history.value]);
}

export function useSearchHistory() {
  init();

  async function add(query: string) {
    await init();

    const q = query.trim();
    if (!q) return;

    history.value = [q, ...history.value.filter((v) => v !== q)].slice(0, LIMIT);

    await persist();
  }

  async function remove(query: string) {
    await init();

    history.value = history.value.filter((v) => v !== query);

    await persist();
  }

  async function clear() {
    await init();

    history.value = [];

    await persist();
  }

  return {
    history,
    add,
    remove,
    clear
  };
}
