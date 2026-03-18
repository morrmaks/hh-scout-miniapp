<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core';
import { inject, ref, watch } from 'vue';

import { useFloatingPosition } from '@/common/composables/useFloatingPosition';

import { tooltipKey } from './tooltip.context';

const ctx = inject(tooltipKey);
if (!ctx) throw new Error('TooltipContent must be inside Tooltip');

const { top, left, placement, update, arrowLeft } = useFloatingPosition(
  ctx.triggerRef,
  ctx.contentRef,
  ctx.open,
  { preferredPlacement: 'top' }
);

/* ---------------- state ---------------- */

const visible = ref(false);
const state = ref<'closed' | 'open'>('closed');

watch(
  () => ctx.open.value,
  (open) => {
    if (open) {
      visible.value = true;

      requestAnimationFrame(() => {
        state.value = 'open';
        update();
      });

      return;
    }

    state.value = 'closed';
  },
  { immediate: true }
);

function onAnimationEnd(e: AnimationEvent) {
  if (e.target !== ctx?.contentRef.value) return;
  if (state.value === 'closed') visible.value = false;
}

/* ---------------- outside ---------------- */

onClickOutside(ctx.contentRef, () => ctx.forceClose(), { ignore: [ctx.triggerRef] });

/* ---------------- mobile ---------------- */

function handleClick() {
  if (ctx?.isMobile()) ctx.forceClose();
}

/* ---------------- viewport ---------------- */

if (window.visualViewport) {
  useEventListener(window.visualViewport, 'resize', update);
  useEventListener(window.visualViewport, 'scroll', update);
}

useEventListener(window, 'scroll', update, { passive: true });
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :ref="(el) => (ctx.contentRef.value = el as HTMLElement)"
      :data-state="state"
      :data-placement="placement"
      class="tooltip-content"
      :style="{
        top: `${top}px`,
        left: `${left}px`
      }"
      @animationend="onAnimationEnd"
      @click="handleClick"
    >
      <div class="inner">
        <slot />
      </div>

      <div class="arrow" :style="{ left: `${arrowLeft}px` }" />
    </div>
  </Teleport>
</template>

<style scoped>
.tooltip-content {
  position: fixed;
  z-index: 1000;

  animation-duration: 0.15s;
  animation-timing-function: ease;
}

/* open */

.tooltip-content[data-state='open'][data-placement='bottom'] {
  animation-name: tooltipDown;
}

.tooltip-content[data-state='open'][data-placement='top'] {
  animation-name: tooltipUp;
}

/* close */

.tooltip-content[data-state='closed'][data-placement='bottom'] {
  animation-name: tooltipDownOut;
}

.tooltip-content[data-state='closed'][data-placement='top'] {
  animation-name: tooltipUpOut;
}

/* animations */

@keyframes tooltipDown {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
}

@keyframes tooltipDownOut {
  to {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
}

@keyframes tooltipUp {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.96);
  }
}

@keyframes tooltipUpOut {
  to {
    opacity: 0;
    transform: translateY(-4px) scale(0.96);
  }
}

/* arrow */

.tooltip-content[data-placement='bottom'] .arrow {
  top: -4px;
}

.tooltip-content[data-placement='top'] .arrow {
  bottom: -4px;
  transform: rotate(225deg);
}

/* inner */

.inner {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;

  padding: 6px 10px;
  font-size: 13px;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.arrow {
  position: absolute;

  width: 8px;
  height: 8px;

  background: var(--card);
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);

  transform: rotate(45deg);
}
</style>
