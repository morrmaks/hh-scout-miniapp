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

    const contentWidth = contentRect.width;
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

    /* ---------------- horizontal ---------------- */

    const triggerCenter = triggerRect.left + triggerRect.width / 2;

    let x = triggerCenter - contentWidth / 2;

    const minX = padding;
    const maxX = windowWidth.value - contentWidth - padding;

    x = Math.max(minX, Math.min(x, maxX));

    left.value = x;

    /* ---------------- arrow ---------------- */

    const rawArrow = triggerCenter - x;

    arrowLeft.value = Math.max(8, Math.min(contentWidth - 8, rawArrow));

    /* ---------------- misc ---------------- */

    minWidth.value = triggerRect.width;
  }

  /* ---------------- reactive update ---------------- */

  watchEffect(() => {
    if (!open.value) return;
    update();
  });

  /* ---------------- resize content ---------------- */

  useResizeObserver(contentRef, () => {
    if (open.value) update();
  });

  /* ---------------- scroll / viewport ---------------- */

  if (window.visualViewport) {
    useEventListener(window.visualViewport, 'resize', update);
    useEventListener(window.visualViewport, 'scroll', update);
  }

  /* fallback */
  useEventListener(window, 'scroll', update, { passive: true });

  return {
    top,
    left,
    arrowLeft,
    maxHeight,
    minWidth,
    placement,
    update
  };
}
