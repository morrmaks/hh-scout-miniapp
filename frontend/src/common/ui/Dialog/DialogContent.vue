<script setup lang="ts">
import { useEventListener, useScrollLock } from '@vueuse/core';
import { X } from 'lucide-vue-next';
import { inject, ref, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import Card from '@/common/ui/Card.vue';

import { DialogContextKey } from './dialog.context';

const ctx = inject(DialogContextKey);
if (!ctx) throw new Error('DialogContent must be inside Dialog');

const lock = useScrollLock(document.body);

const visible = ref(false);
const state = ref<'closed' | 'open'>('closed');

const contentRef = ref<HTMLElement | null>(null);

watch(
  () => ctx.open.value,
  (open) => {
    lock.value = open;

    if (open) {
      visible.value = true;

      requestAnimationFrame(() => {
        state.value = 'open';
      });

      return;
    }

    state.value = 'closed';
  },
  { immediate: true }
);

function close() {
  ctx?.setOpen(false);
}

function onAnimationEnd(e: AnimationEvent) {
  if (e.target !== contentRef.value) return;
  if (state.value === 'closed') visible.value = false;
}

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') close();
});
</script>

<template>
  <Teleport to="body">
    <template v-if="visible">
      <div class="overlay" :data-state="state" @pointerdown.stop />

      <div class="wrapper" @pointerdown.stop @click="close">
        <div
          ref="contentRef"
          class="dialog"
          :data-state="state"
          @click.stop
          @animationend="onAnimationEnd"
        >
          <Card class="card">
            <Button class="close" variant="link" @click="close">
              <X :size="16" />
            </Button>

            <slot :close="close" />
          </Card>
        </div>
      </div>
    </template>
  </Teleport>
</template>

<style scoped>
.wrapper {
  position: fixed;
  inset: 0;
  z-index: 1100;
  pointer-events: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.dialog {
  position: relative;
  cursor: default;

  min-width: 300px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);

  animation-duration: 0.2s;
  animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

.dialog[data-state='open'] {
  animation-name: dialogIn;
}

.dialog[data-state='closed'] {
  animation-name: dialogOut;
}

/* card wrapper */
.card {
  position: relative;
}

/* крестик */
.close {
  position: absolute;
  top: 8px;
  right: 8px;

  padding: 4px;
  height: auto;
}

/* overlay */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1090;
  pointer-events: auto;

  background: rgba(0, 0, 0, 0.45);

  animation-duration: 0.2s;
}

.overlay[data-state='open'] {
  animation-name: fadeIn;
}

.overlay[data-state='closed'] {
  animation-name: fadeOut;
}

/* animations */

@keyframes dialogIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dialogOut {
  to {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>
