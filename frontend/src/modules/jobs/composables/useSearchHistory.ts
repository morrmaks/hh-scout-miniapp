import { ref } from 'vue';

const KEY = 'jobs-search-history';
const LIMIT = 8;

const history = ref<string[]>(load());

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(history.value));
}

export function useSearchHistory() {
  function add(query: string) {
    const q = query.trim();
    if (!q) return;

    history.value = [q, ...history.value.filter((v) => v !== q)].slice(0, LIMIT);

    save();
  }

  function remove(query: string) {
    history.value = history.value.filter((v) => v !== query);
    save();
  }

  function clear() {
    history.value = [];
    save();
  }

  return {
    history,
    add,
    remove,
    clear
  };
}
