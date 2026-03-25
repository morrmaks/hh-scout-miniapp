import type { Ref } from 'vue';

import type { JobsOrderBy } from '@/common/api/generated';

import type { JobsFiltersType } from '../../types/jobs.types';

export interface SearchController {
  favorites: Ref<string[], string[]>;

  history: Ref<SearchHistoryItem[], SearchHistoryItem[]>;
  query: Ref<string, string>;
  suggestions: Ref<string[], string[]>;

  applyHistory: (item: SearchHistoryItem) => void;
  clearHistory: () => void;

  removeHistory: (item: SearchHistoryItem) => void;
  saveFavorite: () => void;
  setQuery: (v: string) => void;
  submit: (v?: string) => Promise<void>;
}

export interface SearchHistoryItem {
  filters: JobsFiltersType;
  orderBy: JobsOrderBy;
  query: string;
  timestamp: number;
}
