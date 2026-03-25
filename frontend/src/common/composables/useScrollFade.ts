import { useResizeObserver, useScroll } from '@vueuse/core';
import { computed, unref } from 'vue';

export function useScrollFade(elRef: any) {
  const { x } = useScroll(elRef);

  const showLeft = computed(() => x.value > 0);

  const showRight = computed(() => {
    const el = unref(elRef);
    if (!el) return false;

    return x.value + el.clientWidth < el.scrollWidth - 1;
  });

  useResizeObserver(elRef, () => x.value);

  return {
    showLeft,
    showRight
  };
}
