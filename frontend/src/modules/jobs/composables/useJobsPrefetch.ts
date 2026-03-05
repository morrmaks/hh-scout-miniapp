import { ref } from 'vue';

import type { Job } from '@/common/api/generated';

import { getJob } from '../api/getJobById';

export function useJob() {
  const job = ref<Job | null>(null);
  const loading = ref(false);

  async function load(id: string) {
    loading.value = true;

    const response = await getJob(id);

    job.value = response.data;

    loading.value = false;
  }

  return {
    job,
    loading,
    load
  };
}
