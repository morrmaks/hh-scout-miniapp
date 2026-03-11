import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Favorite, FavoritesResponse } from '@/common/api/generated';

import {
  deleteFavoriteByJobId,
  getFavorites,
  getFavoritesIds,
  patchFavoriteByJobIdStatus,
  postFavorites
} from '@/common/api/generated';

import type { FavoritesFilters } from '../types/favorites.types';

const DEFAULT_FILTERS: FavoritesFilters = {
  experience: [],
  company: [],
  status: [],
  sort: ''
};

export const useFavoritesStore = defineStore('favorites', () => {
  const userId = ref<number | null>(null);

  const items = ref<Favorite[]>([]);
  const ids = ref<Set<string>>(new Set());

  const filters = ref<FavoritesFilters>({ ...DEFAULT_FILTERS });

  const page = ref(1);
  const pages = ref(0);
  const total = ref(0);

  const loading = ref(false);
  const loadingMore = ref(false);

  const hasMore = computed(() => page.value < pages.value);

  function setUser(id: number) {
    userId.value = id;
  }

  async function fetchIds() {
    if (!userId.value) return;

    const { data } = await getFavoritesIds({
      query: { userId: userId.value }
    });

    ids.value = new Set(data.ids ?? []);
  }

  async function fetchFavorites(reset = false) {
    if (!userId.value) return;

    if (reset) {
      page.value = 1;
      items.value = [];
    }

    loading.value = true;

    try {
      const { data } = await getFavorites({
        query: {
          userId: userId.value,
          page: page.value,
          ...filters.value
        }
      });

      const response = data as FavoritesResponse;

      if (reset) {
        items.value = response.items ?? [];
      } else {
        items.value = [...items.value, ...(response.items ?? [])];
      }

      total.value = response.meta?.total ?? 0;
      pages.value = response.meta?.pages ?? 0;
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (!hasMore.value || loadingMore.value) return;

    loadingMore.value = true;

    try {
      page.value += 1;

      const { data } = await getFavorites({
        query: {
          userId: userId.value!,
          page: page.value,
          ...filters.value
        }
      });

      items.value = [...items.value, ...(data.items ?? [])];
    } finally {
      loadingMore.value = false;
    }
  }

  async function addFavorite(job: Favorite['job']) {
    if (!userId.value) return;

    await postFavorites({
      body: {
        userId: userId.value,
        job
      }
    });

    ids.value.add(job.id);
  }

  async function removeFavorite(jobId: string) {
    if (!userId.value) return;

    await deleteFavoriteByJobId({
      path: { jobId },
      query: { userId: userId.value }
    });

    ids.value.delete(jobId);
    items.value = items.value.filter((j) => j.jobId !== jobId);
  }

  async function toggleFavorite(job: Favorite['job']) {
    if (ids.value.has(job.id)) {
      await removeFavorite(job.id);
    } else {
      await addFavorite(job);
    }
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

    if (item) {
      (item as any).statusId = statusId;
    }
  }

  function setFilters(next: FavoritesFilters) {
    filters.value = {
      ...DEFAULT_FILTERS,
      ...next
    };

    fetchFavorites(true);
  }

  function resetFilters() {
    filters.value = { ...DEFAULT_FILTERS };
    fetchFavorites(true);
  }

  return {
    items,
    ids,
    filters,

    page,
    pages,
    total,

    loading,
    loadingMore,

    hasMore,

    setUser,
    fetchFavorites,
    fetchIds,
    loadMore,

    addFavorite,
    removeFavorite,
    toggleFavorite,

    setStatus,

    setFilters,
    resetFilters
  };
});
