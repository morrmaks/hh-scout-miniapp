import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Job } from '@/common/api/generated';

import { getJobs, getJobsPrefetch } from '@/common/api/generated';

const STEP = 10;
const PREFETCH_TRIGGER = 7;

export const useJobsStore = defineStore('jobs', () => {
  const query = ref('');
  const page = ref(1);
  const index = ref(0);

  const items = ref<Job[]>([]);
  const pages = ref(0);
  const perPage = ref(0);

  const loading = ref(false);

  const currentJob = computed(() => items.value[index.value] ?? null);

  const pagePosition = computed(() => {
    if (!perPage.value) return '0 / 0';
    return `${index.value + 1} / ${perPage.value}`;
  });

  let requestId = 0;

  async function fetchJobs() {
    if (!query.value.trim()) return;

    const id = ++requestId;

    loading.value = true;

    const { data } = await getJobs({
      query: {
        q: query.value,
        page: page.value
      }
    });

    if (id !== requestId) return;

    items.value = data.items;
    pages.value = data.pages;
    perPage.value = data.perPage;

    loading.value = false;
  }

  async function prefetch(index: number) {
    const { data } = await getJobsPrefetch({
      query: {
        q: query.value,
        page: page.value,
        index
      }
    });

    if (!data?.items?.length) return;

    items.value = [...items.value, ...data.items];
  }

  function nextJob() {
    if (index.value < items.value.length - 1) {
      index.value++;

      maybePrefetch();

      return;
    }

    if (items.value.length < perPage.value) {
      prefetch(index.value);
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
    }
  }

  function maybePrefetch() {
    const pos = index.value + 1;

    if (pos % STEP === PREFETCH_TRIGGER) {
      prefetch(index.value);
    }
  }

  function setQuery(q: string) {
    query.value = q;
    page.value = 1;
    index.value = 0;
    items.value = [];

    fetchJobs();
  }

  function setPage(p: number) {
    page.value = p;
    index.value = 0;
    items.value = [];

    fetchJobs();
  }

  return {
    query,
    page,
    pages,
    index,

    items,
    perPage,

    currentJob,
    pagePosition,

    loading,

    fetchJobs,
    setQuery,
    setPage,
    nextJob,
    prevJob
  };
});
