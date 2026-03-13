import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { Favorite, Status } from '@/common/api/generated';

import { useTelegramStore } from '@/app/integrations/telegram';
import {
  deleteFavoriteByJobId,
  getFavorites,
  getFavoritesIds,
  patchFavoriteByJobIdStatus,
  postFavorites
} from '@/common/api/generated';
import { optimistic } from '@/common/lib/optimistic';
import { equalObjects } from '@/common/utils/object';

import type { FavoritesFilters } from '../types/favorites.types';

const DEFAULT_FILTERS: FavoritesFilters = {
  experience: [],
  company: [],
  status: [],
  sort: 'created_desc'
};

export const useFavoritesStore = defineStore('favorites', () => {
  const telegram = useTelegramStore();

  const userId = computed(() => telegram.user?.id ?? null);

  const items = ref<Favorite[]>([]);
  const ids = ref<Set<string>>(new Set());

  const filters = ref<FavoritesFilters>({ ...DEFAULT_FILTERS });

  const companies = ref<string[]>([]);
  const statuses = ref<Status[]>([]);

  const page = ref(1);
  const pages = ref(0);
  const total = ref(0);

  const loading = ref(false);
  const loadingMore = ref(false);
  const invalidated = ref(true);
  const initialized = ref(false);

  const showSkeleton = computed(() => loading.value && !initialized.value);
  const contentDisabled = computed(() => loading.value && initialized.value);
  const hasMore = computed(() => page.value < pages.value);
  const hasFilters = computed(() => !equalObjects(filters.value, DEFAULT_FILTERS));

  function resetState() {
    page.value = 1;
    pages.value = 0;
    total.value = 0;
    // items.value = [];
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
          ...filters.value
        }
      });

      items.value = data.items ?? [];

      pages.value = data.meta?.pages ?? 0;
      total.value = data.meta?.total ?? 0;

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

  function setFilters(next: FavoritesFilters) {
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

    page,
    pages,
    total,

    loading,
    loadingMore,
    initialized,

    showSkeleton,
    contentDisabled,
    hasMore,
    hasFilters,

    fetchFavorites,
    fetchIds,
    loadMore,

    toggleFavorite,
    setStatus,

    setFilters,
    resetFilters
  };
});
