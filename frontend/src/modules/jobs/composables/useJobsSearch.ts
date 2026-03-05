import type { Job } from '@src/common/api/generated';

import { ref } from 'vue';

import { searchJobs } from '../api/searchJobs';

export function useJobsSearch() {
  const jobs = ref<Job[]>([]);
  const loading = ref(false);

  async function load(query: string, page = 1) {
    loading.value = true;

    const result = await searchJobs(query, page);

    jobs.value = result.data.items;

    loading.value = false;
  }

  return {
    jobs,
    loading,
    load
  };
}
