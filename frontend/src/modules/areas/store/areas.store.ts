import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

import type { Area } from '@/common/api/generated';

import { getAreas } from '@/common/api/generated';

export const useAreasStore = defineStore('areas', () => {
  const items = shallowRef<Area[]>([]);
  const loading = ref(false);

  let inFlight: Promise<void> | null = null;

  async function fetchAreas(): Promise<void> {
    if (items.value.length) return;
    if (inFlight) return inFlight;

    loading.value = true;

    inFlight = (async () => {
      try {
        const { data } = await getAreas();
        items.value = data ?? [];
      } catch (err) {
        console.error('Failed to load areas', err);
      } finally {
        loading.value = false;
        inFlight = null;
      }
    })();

    return inFlight;
  }

  return {
    items,
    loading,
    fetchAreas
  };
});
