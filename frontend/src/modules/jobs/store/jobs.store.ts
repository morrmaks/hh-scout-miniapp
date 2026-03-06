import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Job } from '@/common/api/generated';

import { getJobs, getJobsPrefetch } from '@/common/api/generated';

import type { JobFilters } from '../types/jobsFilters';

import { useViewedJobs } from '../composables/useViewedJobs';

const STEP = 10;
const PREFETCH_TRIGGER = 7;
const DEFAULT_FILTERS: JobFilters = {
  order_by: 'relevance',

  area: [],
  employment_form: [],
  work_format: [],
  work_schedule_by_days: [],
  label: []
};

export const useJobsStore = defineStore('jobs', () => {
  const { markViewed } = useViewedJobs();

  const initialized = ref(false);

  const query = ref('');
  const filters = ref<JobFilters>({
    ...DEFAULT_FILTERS
  });

  const page = ref(1);
  const index = ref(0);

  const items = ref<Job[]>([]);
  const pages = ref(0);
  const perPage = ref(0);

  const pageItems = ref(0);

  const loading = ref(false);
  const prefetching = ref(false);

  const prefetchedOffsets = ref(new Set<number>());

  const hasData = computed(() => items.value.length > 0);

  const currentJob = computed(() => items.value[index.value] ?? null);

  const hasFilters = computed(() =>
    Object.entries(filters.value).some(([key, value]) => {
      const def = DEFAULT_FILTERS[key as keyof JobFilters];

      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== def;
    })
  );

  const pagePosition = computed(() => {
    if (!pageItems.value) return '0 / 0';
    return `${index.value + 1} / ${pageItems.value}`;
  });

  let requestId = 0;

  function buildQuery() {
    const queryObject: Record<string, any> = {
      q: query.value,
      page: page.value
    };

    for (const [key, value] of Object.entries(filters.value)) {
      if (Array.isArray(value) && value.length === 0) continue;
      if (value === undefined || value === '') continue;

      queryObject[key] = value;
    }

    return queryObject;
  }

  async function fetchJobs() {
    if (!query.value.trim()) {
      items.value = [];
      pages.value = 0;
      perPage.value = 0;
      pageItems.value = 0;
      return;
    }

    const id = ++requestId;
    loading.value = true;

    try {
      const { data } = await getJobs({
        query: buildQuery()
      });

      if (id !== requestId) return;

      prefetchedOffsets.value.clear();

      items.value = data.items ?? [];
      pages.value = data.pages ?? 0;
      perPage.value = data.perPage ?? 0;
      pageItems.value = data.pageItems ?? 0;

      if (index.value >= items.value.length) index.value = 0;
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
          ...buildQuery(),
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
    const pos = index.value + 1;

    if (pos % STEP !== PREFETCH_TRIGGER) return;

    const offset = Math.floor(index.value / STEP) * STEP + STEP;

    if (prefetchedOffsets.value.has(offset)) return;

    prefetchedOffsets.value.add(offset);

    prefetch(index.value);
  }

  function nextJob() {
    if (currentJob.value) markViewed(currentJob.value.id);

    if (index.value < items.value.length - 1) {
      index.value++;
      maybePrefetch();
      return;
    }

    if (items.value.length < pageItems.value) {
      maybePrefetch();
      return;
    }

    if (page.value < pages.value) {
      page.value++;
      index.value = 0;
      fetchJobs();
    }
  }

  function prevJob() {
    if (index.value > 0) {
      index.value--;
      return;
    }

    if (page.value > 1) {
      page.value--;

      fetchJobs().then(() => {
        index.value = items.value.length - 1;
      });
    }
  }

  function setQuery(q: string) {
    query.value = q;

    page.value = 1;
    index.value = 0;

    prefetchedOffsets.value.clear();

    fetchJobs();
  }

  function setFilters(f: JobFilters) {
    filters.value = {
      ...DEFAULT_FILTERS,
      ...f
    };

    page.value = 1;
    index.value = 0;

    prefetchedOffsets.value.clear();

    fetchJobs();
  }

  function resetFilters() {
    filters.value = { ...DEFAULT_FILTERS };

    page.value = 1;
    index.value = 0;

    prefetchedOffsets.value.clear();

    fetchJobs();
  }

  function setPage(p: number) {
    page.value = p;

    index.value = 0;

    prefetchedOffsets.value.clear();

    fetchJobs();
  }

  function restore() {
    const saved = localStorage.getItem('jobs-position');
    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      query.value = data.query ?? '';
      page.value = data.page ?? 1;
      index.value = data.index ?? 0;

      if (query.value) fetchJobs();
    } catch {
      localStorage.removeItem('jobs-position');
    }
  }

  function savePosition() {
    localStorage.setItem(
      'jobs-position',
      JSON.stringify({
        query: query.value,
        page: page.value,
        index: index.value
      })
    );
  }

  return {
    query,
    filters,

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
    savePosition
  };
});
