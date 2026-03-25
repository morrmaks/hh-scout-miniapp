import { useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';

import { getSuggestsKeywords } from '@/common/api/generated';

const cache = new Map<string, string[]>();

export function useSuggestKeywords(query: () => string) {
  const items = ref<string[]>([]);
  const isLoading = ref(false);

  const fetch = useDebounceFn(async (q: string) => {
    if (q.length < 2) {
      items.value = [];
      return;
    }

    if (cache.has(q)) {
      items.value = cache.get(q)!;
      return;
    }

    isLoading.value = true;

    try {
      const res = await getSuggestsKeywords({
        query: { text: q }
      });

      const result = res.data?.items?.map((i) => i.text) ?? [];

      items.value = result;

      cache.set(q, result);
    } finally {
      isLoading.value = false;
    }
  }, 500);

  watch(
    query,
    (q) => {
      fetch(q);
    },
    { immediate: true }
  );

  return { items, isLoading };
}
