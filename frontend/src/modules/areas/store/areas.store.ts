import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Area } from '@/common/api/generated';

import { getAreas } from '@/common/api/generated';

export const useAreasStore = defineStore('areas', () => {
  const items = ref<Area[]>([]);
  const loading = ref(false);

  async function fetchAreas() {
    if (items.value.length) return;
    if (loading.value) return;

    loading.value = true;

    try {
      const { data } = await getAreas();
      items.value = data ?? [];
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    fetchAreas
  };
});
