import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Job } from '@/common/api/generated';

import { getJobs } from '@/common/api/generated';

export const useJobsStore = defineStore('jobs', () => {
  const query = ref('');
  const page = ref(1);
  const index = ref(0);

  const items = ref<Job[]>([]);
  const pages = ref(0);
  const found = ref(0);

  const loading = ref(false);

  const hasData = computed(() => items.value.length > 0);

  const currentJob = computed(() => {
    return items.value[index.value] ?? null;
  });

  // позиция вакансии на странице
  const pagePosition = computed(() => {
    if (!items.value.length) return '0 / 0';
    return `${index.value + 1} / ${items.value.length}`;
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
      found.value = data.found ?? 0;

      // если индекс выходит за границы
      if (index.value >= items.value.length) {
        index.value = 0;
      }
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
    found,

    currentJob,
    pagePosition,

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
