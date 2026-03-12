import type { Ref } from 'vue';

import { useWindowSize } from '@vueuse/core';
import { nextTick, ref, watch } from 'vue';

interface FloatingOptions {
  gap?: number;
  padding?: number;
}

export function useFloatingPosition(
  triggerRef: Ref<HTMLElement | null>,
  contentRef: Ref<HTMLElement | null>,
  open: Ref<boolean>,
  options: FloatingOptions = {}
) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const gap = options.gap ?? 6;
  const padding = options.padding ?? 8;

  const top = ref(0);
  const left = ref(0);
  const maxHeight = ref<number>();
  const minWidth = ref<number>();

  async function update() {
    await nextTick();

    const trigger = triggerRef.value;
    const content = contentRef.value;

    if (!trigger || !content) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    const contentHeight = content.scrollHeight || contentRect.height;
    const contentWidth = contentRect.width;

    // ширина ≥ trigger
    minWidth.value = triggerRect.width;

    const spaceBelow = windowHeight.value - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    const placeTop = spaceBelow < contentHeight && spaceAbove > spaceBelow;

    // вертикаль
    top.value = placeTop ? triggerRect.top - contentHeight - gap : triggerRect.bottom + gap;

    maxHeight.value = placeTop ? spaceAbove - padding : spaceBelow - padding;

    // горизонталь
    let x = triggerRect.left;

    const overflowRight = x + contentWidth + padding - windowWidth.value;

    const overflowLeft = padding - x;

    if (overflowRight > 0) x -= overflowRight;
    if (overflowLeft > 0) x += overflowLeft;

    left.value = x;
  }

  // только при открытии
  watch(open, (v) => v && update());

  // только при resize окна
  watch([windowWidth, windowHeight], () => open.value && update());

  return {
    top,
    left,
    maxHeight,
    minWidth,
    update
  };
}
