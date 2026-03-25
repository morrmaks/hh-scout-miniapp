import type { Ref } from 'vue';

import { useEventListener, useResizeObserver, useWindowSize } from '@vueuse/core';
import { nextTick, ref, watchEffect } from 'vue';

interface FloatingOptions {
  gap?: number;
  padding?: number;
  preferredPlacement?: 'bottom' | 'top';
}

const MIN_SPACE = 120;

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
  const arrowLeft = ref(0);

  const maxHeight = ref<number>();
  const minWidth = ref<number>();
  const placement = ref<'bottom' | 'top'>('bottom');

  async function update() {
    await nextTick();

    const trigger = triggerRef.value;
    const content = contentRef.value;

    if (!trigger || !content) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    const contentWidth = content.scrollWidth;
    const contentHeight = contentRect.height;

    /* ---------------- vertical ---------------- */

    const spaceBelow = windowHeight.value - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    const preferred = options.preferredPlacement ?? 'bottom';

    let placeTop = false;

    if (preferred === 'top') placeTop = spaceAbove >= MIN_SPACE || spaceAbove > spaceBelow;
    else placeTop = !(spaceBelow >= MIN_SPACE || spaceBelow > spaceAbove);

    placement.value = placeTop ? 'top' : 'bottom';

    maxHeight.value = placeTop ? spaceAbove - padding : spaceBelow - padding;

    top.value = placeTop ? triggerRect.top - contentHeight - gap : triggerRect.bottom + gap;

    const triggerWidth = triggerRect.width;

    minWidth.value = triggerWidth;

    const width = Math.max(contentWidth, triggerWidth);

    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    let x = triggerCenter - contentWidth / 2;

    const minX = padding;
    const maxX = windowWidth.value - width - padding;

    x = Math.max(minX, Math.min(x, maxX));

    left.value = x;

    const rawArrow = triggerCenter - left.value;
    arrowLeft.value = Math.max(8, Math.min(width - 8, rawArrow));
  }

  watchEffect(() => {
    if (!open.value) return;
    update();
  });

  useResizeObserver(contentRef, () => {
    if (open.value) update();
  });

  if (window.visualViewport) {
    useEventListener(window.visualViewport, 'resize', update);
    useEventListener(window.visualViewport, 'scroll', update);
  }

  useEventListener(window, 'scroll', update, { passive: true });

  return {
    top,
    left,
    maxHeight,
    minWidth,
    placement,
    arrowLeft,
    update
  };
}
