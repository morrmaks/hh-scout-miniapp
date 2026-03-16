import type { Ref } from 'vue';

import { useEventListener } from '@vueuse/core';
import { ref } from 'vue';

export function useToastDrag(el: Ref<HTMLElement | null>, onDismiss: () => void) {
  const startX = ref(0);
  const dragging = ref(false);

  let offsetX = 0;

  const DISMISS_THRESHOLD = 120;
  const DRAG_DAMPING = 0.8;

  function setTransform(x: number) {
    const element = el.value;
    if (!element) return;

    element.style.setProperty('--drag-x', `${x}px`);
  }

  function resetTransform() {
    el.value?.style.removeProperty('--drag-x');
  }

  function onPointerDown(e: PointerEvent) {
    dragging.value = true;
    startX.value = e.clientX;
    (e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);

    el.value?.classList.add('dragging');
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging.value) return;

    const dx = e.clientX - startX.value;
    offsetX = dx * DRAG_DAMPING;

    setTransform(offsetX);
  }

  function onPointerUp() {
    if (!dragging.value) return;

    dragging.value = false;
    el.value?.classList.remove('dragging');

    if (Math.abs(offsetX) > DISMISS_THRESHOLD) onDismiss();
    else resetTransform();

    offsetX = 0;
  }

  useEventListener(window, 'pointermove', onPointerMove);
  useEventListener(window, ['pointerup', 'pointercancel'], onPointerUp);

  return {
    onPointerDown
  };
}
