import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Job } from '@/common/api/generated';

import { getJobs } from '@/common/api/generated';

import { prefetchJobs } from '../api/prefetchJobs';

export const useJobsStore = defineStore('jobs', () => {
  const query = ref('');
  const page = ref(1);
  const index = ref(0);

  const items = ref<Job[]>([]);
  const pages = ref(0);

  const loading = ref(false);

  const hasData = computed(() => items.value.length > 0);

  const currentJob = computed(() => {
    return items.value[index.value] ?? null;
  });

  let requestId = 0;

  async function fetchJobs() {
    if (!query.value.trim()) return;

    const id = ++requestId;

    loading.value = true;

    try {
      const { data } = await getJobs({
        query: {
          q: query.value,
          page: page.value
        }
      });

      if (id !== requestId) return;

      items.value = data.items ?? [];
      pages.value = data.pages ?? 0;

      prefetchNext(data.items ?? []);
    } finally {
      if (id === requestId) {
        loading.value = false;
      }
    }
  }

  function setQuery(q: string) {
    if (q === query.value) return;

    query.value = q;
    page.value = 1;
    index.value = 0;

    fetchJobs();
  }

  function setPage(p: number) {
    if (p === page.value) return;

    page.value = p;
    index.value = 0;

    fetchJobs();
  }

  function nextJob() {
    if (index.value < items.value.length - 1) {
      index.value++;
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

  function maybePrefetch() {
    const pos = index.value;

    if (pos % 10 !== 7) return;

    const start = pos + 1;
    const end = start + 10;

    const ids = items.value
      .slice(start, end)
      .map((j) => j.id)
      .filter(Boolean) as string[];

    if (!ids.length) return;

    prefetchJobs(ids);
  }

  function prefetchNext(jobs: Job[]) {
    const ids = jobs
      .slice(0, 10)
      .map((j) => j.id)
      .filter(Boolean) as string[];

    if (ids.length) prefetchJobs(ids);
  }

  function restore() {
    const saved = localStorage.getItem('jobs-position');

    if (!saved) return;

    const data = JSON.parse(saved);

    query.value = data.query;
    page.value = data.page;
    index.value = data.index;
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
    page,
    pages,
    index,

    items,
    currentJob,
    loading,
    hasData,

    fetchJobs,
    setQuery,
    setPage,
    nextJob,
    prevJob,

    restore,
    savePosition
  };
});
