import { computed } from 'vue';

import type { SearchController, SearchHistoryItem } from '../types/search.types';

import { useJobsStore } from '../../store/jobs.store';
import { useSearchFavorite } from './useSearchFavorite';
import { useSearchHistory } from './useSearchHistory';
import { useSuggestKeywords } from './useSuggestKeywords';

export function useSearchController(): SearchController {
  const store = useJobsStore();

  const history = useSearchHistory();
  const favorite = useSearchFavorite();

  const query = computed({
    get: () => store.query,
    set: (v: string) => (store.query = v)
  });

  const { items: suggestions } = useSuggestKeywords(() => query.value);

  /* ---------------- actions ---------------- */

  function setQuery(v: string) {
    store.query = v;
  }

  function applyHistory(item: SearchHistoryItem) {
    store.applySearch(item);
  }

  async function submit(value?: string) {
    const q = (value ?? query.value).trim();
    if (!q) return;

    await store.setQuery(q);
  }

  function saveFavorite() {
    const q = query.value.trim();
    if (!q) return;

    favorite.add(q);
  }

  const suggestionItems = computed(() => {
    const q = query.value.trim();

    if (!q) return [];

    if (q.length < 2) return [q];

    return [q, ...suggestions.value.filter((i) => i !== q)];
  });

  return {
    query,

    suggestions: suggestionItems,
    history: history.history,
    favorites: favorite.history,

    submit,
    saveFavorite,
    applyHistory,
    setQuery,

    removeHistory: history.remove,
    clearHistory: history.clear
  };
}
