import { ref } from 'vue';

import { dbGet, dbSet } from '@/common/lib/indexedDb';

import type { SearchHistoryItem } from '../types/search.types';

const KEY = 'jobs-search-history';
const LIMIT = 50;

const history = ref<SearchHistoryItem[]>([]);
let ready: Promise<void> | null = null;

function serialize(item: SearchHistoryItem) {
  return JSON.stringify({
    q: item.query,
    f: item.filters,
    o: item.orderBy
  });
}

function init() {
  if (!ready) {
    ready = dbGet<SearchHistoryItem[]>(KEY).then((data) => {
      history.value = data ?? [];
    });
  }
  return ready;
}

function persist() {
  return dbSet(KEY, JSON.parse(JSON.stringify(history.value)));
}

async function ensure() {
  await init();
}

export function useSearchHistory() {
  init();

  async function add(item: SearchHistoryItem) {
    await ensure();

    const key = serialize(item);

    history.value = [item, ...history.value.filter((v) => serialize(v) !== key)].slice(0, LIMIT);

    return persist();
  }

  async function remove(item: SearchHistoryItem) {
    await ensure();

    const key = serialize(item);

    history.value = history.value.filter((v) => serialize(v) !== key);

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
