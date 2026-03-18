import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

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
import { useResumesStore } from '@/modules/resumes';
import { toast } from '@/modules/toast';

import type { FavoritesFiltersType } from '../types/favorites.types';

import { DEFAULT_FILTERS } from '../filters';

export const useFavoritesStore = defineStore('favorites', () => {
  const telegram = useTelegramStore();
  const resumes = useResumesStore();

  const userId = computed(() => telegram.user?.id ?? null);
  const activeResumeId = computed(() => resumes.activeResumeId);

  /* ---------------- state ---------------- */

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

  /* ---------------- computed ---------------- */

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

  /* ---------------- helpers ---------------- */

  function resetState() {
    page.value = 1;
    pages.value = 0;
  }

  function invalidate() {
    invalidated.value = true;
  }

  /* ---------------- API ---------------- */

  async function fetchIds() {
    if (!userId.value) return;

    const { data } = await getFavoritesIds();
    ids.value = new Set(data.ids ?? []);
  }

  async function fetchFavorites() {
    if (!userId.value || !activeResumeId.value || loading.value || !invalidated.value) return;

    if (invalidated.value) {
      resetState();
      invalidated.value = false;
    }

    loading.value = true;

    try {
      const { data } = await getFavorites({
        query: {
          resumeId: activeResumeId.value,
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
    if (
      !userId.value ||
      !activeResumeId.value ||
      loading.value ||
      loadingMore.value ||
      !hasMore.value
    )
      return;

    loadingMore.value = true;

    try {
      page.value += 1;

      const { data } = await getFavorites({
        query: {
          resumeId: activeResumeId.value,
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

  /* ---------------- mutations ---------------- */

  async function saveFavorite(jobId: string, resumeIds: number[]) {
    if (!userId.value || !resumeIds.length) return;

    await optimistic({
      scope: 'favorites',
      key: jobId,

      apply() {
        ids.value.add(jobId);
      },

      rollback() {
        toast.error('Не удалось добавить в избранное');
        ids.value.delete(jobId);
      },

      async run() {
        return postFavorites({
          body: { jobId, resumeIds }
        });
      }
    });

    invalidate();
  }

  async function deleteFavorite(jobId: string, resumeIds: number[]) {
    if (!userId.value || !resumeIds.length) return;

    const index = items.value.findIndex((i) => i.jobId === jobId);
    const hasIndex = index !== -1;
    const removedItem = items.value[index];

    await optimistic({
      scope: 'favorites',
      key: jobId,

      apply() {
        ids.value.delete(jobId);

        if (!resumeIds.includes(activeResumeId.value!) || !hasIndex) return;

        items.value.splice(index, 1);
        totalFound.value--;
        if (totalAll.value > 0) totalAll.value--;
      },

      rollback() {
        toast.error('Не удалось удалить из избранного');

        ids.value.add(jobId);

        if (!resumeIds.includes(activeResumeId.value!) || !hasIndex) return;

        if (removedItem) items.value.splice(index, 0, removedItem);

        totalAll.value++;
        totalFound.value++;
      },

      async run() {
        return deleteFavoriteByJobId({
          path: { jobId },
          query: { resumeIds }
        });
      }
    });
  }

  async function toggleFavorite(jobId: string) {
    if (!userId.value || !activeResumeId.value) return;

    const wasFavorite = ids.value.has(jobId);
    const resumeIds = resumes.defaultSaveResumeIds;
    if (!resumeIds.length) return;

    if (wasFavorite) return deleteFavorite(jobId, resumeIds);

    return saveFavorite(jobId, resumeIds);
  }

  async function exportExcel() {
    if (!userId.value || !activeResumeId.value) return;

    await getFavoritesExport({
      query: { resumeId: activeResumeId.value }
    });

    toast.success('Excel файл отправлен в чат');
  }

  async function setStatus(jobId: string, statusId: number | null) {
    if (!userId.value || !activeResumeId.value) return;

    await patchFavoriteByJobIdStatus({
      path: { jobId },
      body: {
        resumeId: activeResumeId.value,
        statusId
      }
    });

    const item = items.value.find((i) => i.jobId === jobId);
    if (item) item.statusId = statusId;
  }

  /* ---------------- setters ---------------- */

  function setSort(value: FavoritesSort) {
    if (sort.value === value) return;
    sort.value = value;
    invalidate();
  }

  function setFilters(next: FavoritesFiltersType) {
    const merged = { ...DEFAULT_FILTERS, ...next };
    if (equalObjects(filters.value, merged)) return;

    filters.value = merged;
    invalidate();
  }

  function setQuery(text: string) {
    const value = text.trim();
    if (value === lastSearchQuery.value) return;

    lastSearchQuery.value = value;
    query.value = value;
    invalidate();
  }

  function resetFilters() {
    if (!hasFilters.value) return;

    filters.value = { ...DEFAULT_FILTERS };
    invalidate();
  }

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
    invalidated,

    showSkeleton,
    contentDisabled,
    hasMore,
    hasFilters,
    isEmpty,
    emptyMessage,
    resultsMessage,

    fetchIds,
    fetchFavorites,
    loadMore,
    exportExcel,
    saveFavorite,
    deleteFavorite,
    toggleFavorite,

    setStatus,
    setQuery,
    setSort,
    setFilters,
    resetFilters,

    invalidate
  };
});
