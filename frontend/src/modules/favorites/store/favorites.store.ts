import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { Favorite, FavoritesSort, Status } from '@/common/api/generated';

import { useTelegramStore } from '@/app/integrations/telegram';
import {
  deleteFavoriteByJobId,
  getFavorites,
  getFavoritesExport,
  getFavoritesIds,
  patchFavoriteByJobIdStatus,
  postFavorites
} from '@/common/api/generated';
import { optimistic } from '@/common/lib/optimistic';
import { equalObjects } from '@/common/utils/object';

import type { FavoritesFiltersType } from '../types/favorites.types';

import { DEFAULT_FILTERS } from '../filters';

export const useFavoritesStore = defineStore('favorites', () => {
  const telegram = useTelegramStore();

  const userId = computed(() => telegram.user?.id ?? null);

  const items = ref<Favorite[]>([]);
  const ids = ref<Set<string>>(new Set());

  const filters = ref<FavoritesFiltersType>({ ...DEFAULT_FILTERS });
  const sort = ref<FavoritesSort>('created_desc');

  const companies = ref<string[]>([]);
  const statuses = ref<Status[]>([]);

  const query = ref('');
  const lastSearchQuery = ref('');
  const page = ref(1);
  const pages = ref(0);
  const totalFound = ref(0);
  const totalAll = ref(0);

  const loading = ref(false);
  const loadingMore = ref(false);
  const invalidated = ref(true);
  const initialized = ref(false);

  const showSkeleton = computed(() => loading.value && !initialized.value);
  const contentDisabled = computed(() => loading.value && initialized.value);
  const hasMore = computed(() => page.value < pages.value);
  const isEmpty = computed(() => initialized.value && totalFound.value === 0);
  const hasFilters = computed(() => !equalObjects(filters.value, DEFAULT_FILTERS));

  const emptyMessage = computed(() => {
    if (!isEmpty.value) return null;

    return hasFilters.value ? 'По выбранным фильтрам ничего не найдено' : 'Избранного пока нет';
  });

  const resultsMessage = computed(() => {
    if (!initialized.value) return '';

    if (!hasFilters.value && !query.value) return `Всего ${totalAll.value} вакансий`;

    if (query.value)
      return `Найдено ${totalFound.value} из ${totalAll.value} вакансий по запросу "${query.value}"`;

    return `Найдено ${totalFound.value} из ${totalAll.value} вакансий`;
  });

  function resetState() {
    page.value = 1;
    pages.value = 0;
  }

  async function fetchIds() {
    if (!userId.value) return;

    const { data } = await getFavoritesIds({
      query: { userId: userId.value }
    });

    ids.value = new Set(data.ids ?? []);
  }

  async function fetchFavorites() {
    if (!userId.value || loading.value || (!invalidated.value && items.value.length)) return;

    if (invalidated.value) {
      resetState();
      invalidated.value = false;
    }

    loading.value = true;

    try {
      const { data } = await getFavorites({
        query: {
          userId: userId.value,
          page: page.value,
          text: query.value || undefined,
          sort: sort.value,
          ...filters.value
        }
      });

      items.value = data.items ?? [];

      pages.value = data.meta?.pages ?? 0;
      totalFound.value = data.meta?.totalFound ?? 0;
      totalAll.value = data.meta?.totalAll ?? 0;

      if (data.filters) {
        companies.value = data.filters.companies ?? [];
        statuses.value = data.filters.statuses ?? [];
      }

      initialized.value = true;
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (!userId.value || loading.value || loadingMore.value || !hasMore.value) return;

    loadingMore.value = true;

    try {
      page.value += 1;

      const { data } = await getFavorites({
        query: {
          userId: userId.value,
          page: page.value,
          text: query.value || undefined,
          sort: sort.value,
          ...filters.value
        }
      });

      items.value.push(...(data.items ?? []));
    } finally {
      loadingMore.value = false;
    }
  }

  async function toggleFavorite(jobId: string) {
    if (!userId.value) return;

    const wasFavorite = ids.value.has(jobId);

    await optimistic({
      scope: 'favorites',
      key: jobId,

      apply() {
        if (wasFavorite) {
          ids.value.delete(jobId);
          items.value = items.value.filter((i) => i.jobId !== jobId);
        } else {
          ids.value.add(jobId);
          invalidated.value = true;
        }
      },

      rollback() {
        if (wasFavorite) {
          ids.value.add(jobId);
        } else {
          ids.value.delete(jobId);
        }
      },

      async run() {
        if (wasFavorite) {
          return deleteFavoriteByJobId({
            path: { jobId },
            query: { userId: userId.value! }
          });
        }

        return postFavorites({
          body: {
            userId: userId.value!,
            jobId
          }
        });
      }
    });
  }

  async function exportExcel() {
    if (!userId.value) return;

    const { data } = await getFavoritesExport({
      query: { userId: userId.value },
      config: {
        parse: 'blob'
      }
    });

    const url = URL.createObjectURL(data);

    const a = document.createElement('a');
    a.href = url;
    a.download = `favorites_${userId.value}.xlsx`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function setStatus(jobId: string, statusId: number | null) {
    if (!userId.value) return;

    await patchFavoriteByJobIdStatus({
      path: { jobId },
      body: {
        userId: userId.value,
        statusId
      }
    });

    const item = items.value.find((i) => i.jobId === jobId);

    if (item) item.statusId = statusId;
  }

  function setSort(value: FavoritesSort) {
    if (sort.value === value) return;

    sort.value = value;
    invalidated.value = true;

    fetchFavorites();
  }

  function setFilters(next: FavoritesFiltersType) {
    const merged = { ...DEFAULT_FILTERS, ...next };

    if (equalObjects(filters.value, merged)) return;

    filters.value = merged;
    invalidated.value = true;

    fetchFavorites();
  }

  function resetFilters() {
    if (!hasFilters.value) return;

    filters.value = { ...DEFAULT_FILTERS };

    invalidated.value = true;
    fetchFavorites();
  }

  function setQuery(text: string) {
    const value = text.trim();

    if (value === lastSearchQuery.value) return;
    lastSearchQuery.value = value;

    query.value = value;
    invalidated.value = true;

    fetchFavorites();
  }

  watch(
    userId,
    (id) => {
      if (!id) return;

      fetchIds();
      invalidated.value = true;
      fetchFavorites();
    },
    { immediate: true }
  );

  return {
    items,
    ids,

    filters,
    companies,
    statuses,

    query,
    lastSearchQuery,
    page,
    pages,
    sort,

    loading,
    loadingMore,
    initialized,

    showSkeleton,
    contentDisabled,
    hasMore,
    hasFilters,
    isEmpty,
    emptyMessage,
    resultsMessage,

    fetchFavorites,
    fetchIds,
    loadMore,
    exportExcel,
    toggleFavorite,

    setStatus,
    setQuery,
    setSort,

    setFilters,
    resetFilters
  };
});
