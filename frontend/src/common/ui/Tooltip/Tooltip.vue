<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { provide, ref } from 'vue';

import { tooltipKey } from './tooltip.context';

const props = withDefaults(
  defineProps<{
    openDelay?: number;
    closeDelay?: number;
    mobileDelay?: number;
    disabled?: boolean;
  }>(),
  {
    openDelay: 100,
    closeDelay: 100,
    mobileDelay: 2000,
    disabled: false
  }
);

const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const open = ref(false);

/* ---------------- utils ---------------- */

function isMobile() {
  return window.matchMedia('(hover: none)').matches;
}

/* ---------------- timers ---------------- */

let openTimeout: number | null = null;
let closeTimeout: number | null = null;

function clearTimers() {
  openTimeout && clearTimeout(openTimeout);
  closeTimeout && clearTimeout(closeTimeout);
}

/* ---------------- actions ---------------- */

function openTooltip() {
  if (props.disabled) return;

  clearTimers();

  openTimeout = window.setTimeout(() => {
    open.value = true;
  }, props.openDelay);
}

function closeTooltip() {
  clearTimers();

  closeTimeout = window.setTimeout(() => {
    open.value = false;
  }, props.closeDelay);
}

function forceClose() {
  clearTimers();
  open.value = false;
}

function toggleMobile() {
  if (props.disabled) return;

  clearTimers();

  open.value = true;

  closeTimeout = window.setTimeout(() => {
    open.value = false;
  }, props.mobileDelay);
}

/* ---------------- escape ---------------- */

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') forceClose();
});

/* ---------------- provide ---------------- */

provide(tooltipKey, {
  open,
  triggerRef,
  contentRef,

  openTooltip,
  closeTooltip,
  forceClose,
  toggleMobile,

  isMobile,
  disabled: props.disabled
});
</script>

<template>
  <span class="tooltip-root">
    <slot />
  </span>
</template>

<style scoped>
.tooltip-root {
  display: inline-flex;
}
</style>
