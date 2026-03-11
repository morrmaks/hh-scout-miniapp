import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { Job } from '@/common/api/generated';

import { getJobs, getJobsPrefetch } from '@/common/api/generated';

import type { JobsQueryParams } from '../types/jobs.types';

import { useJobsPosition } from '../composables/useJobsPosition';
import { useViewedJobs } from '../composables/useViewedJobs';
import { buildApiQuery, buildUrlQuery, resolveSearchState } from '../lib/search';
import { equalFilters } from '../utils/equalFilters';

const STEP = 10;
const PREFETCH_TRIGGER = 7;

const DEFAULT_FILTERS: JobsQueryParams = {
  per_page: 100,
  order_by: 'relevance',
  currency: 'RUR',
  area: [],
  employment_form: [],
  work_format: [],
  experience: [],
  label: []
};

export const useJobsStore = defineStore('jobs', () => {
  const router = useRouter();

  const { markViewed } = useViewedJobs();
  const { save, restore: restorePosition } = useJobsPosition();

  const initialized = ref(false);

  const query = ref('');
  const lastSearchQuery = ref('');
  const filters = ref<JobsQueryParams>({ ...DEFAULT_FILTERS });

  const page = ref(1);
  const index = ref(0);

  const items = ref<Job[]>([]);
  const found = ref(0);
  const pages = ref(0);
  const perPage = ref(0);
  const pageItems = ref(0);

  const loading = ref(false);
  const prefetching = ref(false);
  const prefetchedOffsets = ref(new Set<number>());
  const restoreMode = ref(false);

  const hasData = computed(() => items.value.length > 0);
  const currentJob = computed(() => items.value[index.value] ?? null);

  const hasFilters = computed(() => !equalFilters(filters.value, DEFAULT_FILTERS));

  const pagePosition = computed(() => {
    if (!pageItems.value) return '0 / 0';
    return `${index.value + 1} / ${pageItems.value}`;
  });

  let requestId = 0;

  function clearResults() {
    items.value = [];
    found.value = 0;
    pages.value = 0;
    perPage.value = 0;
    pageItems.value = 0;
  }

  async function fetchJobs() {
    if (!query.value.trim()) {
      clearResults();
      return;
    }

    const id = ++requestId;
    loading.value = true;

    try {
      const { data } = await getJobs({
        query: buildApiQuery(query.value, page.value, index.value, filters.value, restoreMode.value)
      });

      if (id !== requestId) return;

      prefetchedOffsets.value.clear();

      items.value = data.items ?? [];
      found.value = data.found ?? 0;
      pages.value = data.pages ?? 0;
      perPage.value = data.perPage ?? 0;
      pageItems.value = data.pageItems ?? 0;

      if (index.value >= items.value.length) index.value = 0;

      restoreMode.value = false;
    } finally {
      if (id === requestId) {
        loading.value = false;
        initialized.value = true;
      }
    }
  }

  async function prefetch(indexValue: number) {
    if (prefetching.value) return;
    prefetching.value = true;

    try {
      const { data } = await getJobsPrefetch({
        query: {
          ...buildApiQuery(query.value, page.value, index.value, filters.value, restoreMode.value),
          index: indexValue
        }
      });

      if (!data?.items?.length) return;

      const remaining = pageItems.value - items.value.length;
      if (remaining <= 0) return;

      items.value = [...items.value, ...data.items.slice(0, remaining)];
    } finally {
      prefetching.value = false;
    }
  }

  function maybePrefetch() {
    if ((index.value + 1) % STEP !== PREFETCH_TRIGGER) return;

    const offset = Math.floor(index.value / STEP) * STEP + STEP;

    if (prefetchedOffsets.value.has(offset)) return;
    prefetchedOffsets.value.add(offset);

    prefetch(index.value);
  }

  function nextJob() {
    currentJob.value && markViewed(currentJob.value.id);

    if (index.value < items.value.length - 1) {
      index.value++;
      maybePrefetch();
      commitNavigation();
    }
  }

  function prevJob() {
    if (index.value > 0) {
      index.value--;
      commitNavigation();
    }
  }

  async function setQuery(text: string) {
    const value = text.trim();

    if (value === lastSearchQuery.value) return;
    lastSearchQuery.value = value;

    if (!value) {
      query.value = '';
      clearResults();
      resetNavigation();
      commitNavigation();
      return;
    }

    query.value = value;

    resetNavigation();
    await fetchJobs();
    commitNavigation();
  }

  function setFilters(next: JobsQueryParams) {
    if (equalFilters(filters.value, next)) return;

    filters.value = { ...DEFAULT_FILTERS, ...next };

    resetNavigation();
    fetchJobs();
    commitNavigation();
  }

  function resetFilters() {
    filters.value = { ...DEFAULT_FILTERS };

    resetNavigation();
    fetchJobs();
    commitNavigation();
  }

  async function setPage(p: number) {
    page.value = p;
    index.value = 0;
    prefetchedOffsets.value.clear();

    await fetchJobs();
    commitNavigation();
  }

  function resetNavigation() {
    page.value = 1;
    index.value = 0;
    prefetchedOffsets.value.clear();
  }

  function commitNavigation() {
    save(query.value, page.value, index.value, filters.value);

    router.replace({
      query: buildUrlQuery(query.value, page.value, index.value, filters.value)
    });
  }

  async function restore() {
    const route = useRoute();

    const state = await resolveSearchState(route.query, restorePosition, DEFAULT_FILTERS);

    if (!state) return;

    query.value = state.query;
    lastSearchQuery.value = state.query;
    page.value = state.page;
    index.value = state.index;
    filters.value = state.filters;

    restoreMode.value = true;

    if (query.value) await fetchJobs();
  }

  return {
    query,
    lastSearchQuery,
    filters,

    found,
    page,
    pages,
    index,

    items,
    perPage,
    pageItems,

    currentJob,
    hasFilters,
    pagePosition,

    loading,
    initialized,
    hasData,

    fetchJobs,
    setQuery,
    setFilters,
    resetFilters,
    setPage,

    nextJob,
    prevJob,

    restore,
    commitNavigation
  };
});
