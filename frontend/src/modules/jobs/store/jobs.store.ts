import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Job } from '@/common/api/generated';

import { getJobs, getJobsPrefetch } from '@/common/api/generated';

import type { JobFilters } from '../types/jobsFilters';

const STEP = 10;
const PREFETCH_TRIGGER = 7;

export const useJobsStore = defineStore('jobs', () => {
  const query = ref('');
  const filters = ref<JobFilters>({});

  const page = ref(1);
  const index = ref(0);

  const items = ref<Job[]>([]);
  const pages = ref(0);
  const perPage = ref(0);

  const loading = ref(false);
  const prefetching = ref(false);

  const prefetchedOffsets = ref(new Set<number>());

  const hasData = computed(() => items.value.length > 0);

  const currentJob = computed(() => items.value[index.value] ?? null);

  const pagePosition = computed(() => {
    if (!perPage.value) return '0 / 0';
    return `${index.value + 1} / ${perPage.value}`;
  });

  let requestId = 0;

  function buildQuery() {
    return {
      q: query.value,
      page: page.value,
      ...filters.value
    };
  }

  async function fetchJobs() {
    if (!query.value.trim()) {
      items.value = [];
      pages.value = 0;
      perPage.value = 0;
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

      if (index.value >= items.value.length) index.value = 0;
    } finally {
      if (id === requestId) loading.value = false;
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

      const remaining = perPage.value - items.value.length;
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
    if (index.value < items.value.length - 1) {
      index.value++;
      maybePrefetch();

      return;
    }

    if (items.value.length < perPage.value) {
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
    items.value = [];

    prefetchedOffsets.value.clear();

    fetchJobs();
  }

  function setFilters(f: JobFilters) {
    filters.value = f;

    page.value = 1;
    index.value = 0;
    items.value = [];

    prefetchedOffsets.value.clear();

    fetchJobs();
  }

  function setPage(p: number) {
    page.value = p;

    index.value = 0;
    items.value = [];

    prefetchedOffsets.value.clear();

    fetchJobs();
  }

  function restore() {
    const saved = localStorage.getItem('jobs-position');

    if (!saved) return;

    const data = JSON.parse(saved);

    query.value = data.query;
    page.value = data.page;
    index.value = data.index;

    fetchJobs();
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

    currentJob,
    pagePosition,

    loading,
    hasData,

    fetchJobs,
    setQuery,
    setFilters,
    setPage,

    nextJob,
    prevJob,

    restore,
    savePosition
  };
});
