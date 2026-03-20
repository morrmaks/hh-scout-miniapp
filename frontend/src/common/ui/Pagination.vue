<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import { buildPagination } from '@/common/utils/pagination';

import Button from './Button.vue';
import Scrubber from './Scrubber.vue';

interface Props {
  currentPage: number;
  disabled?: boolean;
  totalPages: number;
  window?: number;
}

const props = withDefaults(defineProps<Props>(), {
  window: 2,
  disabled: false
});

const emit = defineEmits<{
  change: [number];
}>();

function change(page: number) {
  if (props.disabled) return;
  if (page === props.currentPage) return;
  if (page < 1 || page > props.totalPages) return;

  emit('change', page);
}

const items = computed(() => buildPagination(props.currentPage, props.totalPages, props.window));

const showScrubber = ref(false);
const scrubber = ref<InstanceType<typeof Scrubber> | null>(null);

const skipMove = ref(false);
const lastX = ref(0);

function startPress(e: PointerEvent) {
  showScrubber.value = true;
  lastX.value = e.clientX;
  skipMove.value = true;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onMove(e: PointerEvent) {
  if (!showScrubber.value) return;

  if (skipMove.value) {
    skipMove.value = false;
    lastX.value = e.clientX;
    return;
  }

  const dx = e.clientX - lastX.value;
  lastX.value = e.clientX;

  scrubber.value?.move(dx);
}

function stopPress() {
  const page = scrubber.value?.current;
  if (page) change(page);
  showScrubber.value = false;
}

useEventListener(window, 'pointermove', onMove);
useEventListener(window, 'pointerup', stopPress);
useEventListener(window, 'pointercancel', stopPress);
</script>

<template>
  <div class="pagination" :class="{ disabled }">
    <!-- jump start -->

    <Button
      class="mobile-edge"
      variant="link"
      :disabled="disabled || currentPage === 1"
      @click="change(1)"
    >
      <ChevronsLeft :size="16" />
    </Button>

    <!-- prev -->

    <Button
      variant="link"
      :disabled="disabled || currentPage === 1"
      @click="change(currentPage - 1)"
    >
      <ChevronLeft :size="16" />
    </Button>

    <!-- desktop pages -->

    <div class="pages">
      <template v-for="(item, i) in items" :key="i">
        <span v-if="item.type === 'dots'" class="dots"> ... </span>

        <Button
          v-else
          variant="ghost"
          :active="item.page === currentPage"
          :disabled="disabled"
          @click="change(item.page)"
        >
          {{ item.page }}
        </Button>
      </template>
    </div>

    <!-- mobile info -->

    <div class="mobile-info" @pointerdown.prevent="startPress">
      <span class="current">
        {{ currentPage }}
      </span>

      <span class="divider"> / </span>

      <span class="total">
        {{ totalPages }}
      </span>

      <Scrubber v-if="showScrubber" ref="scrubber" :model-value="currentPage" :total="totalPages" />
    </div>

    <!-- next -->

    <Button
      variant="link"
      :disabled="disabled || currentPage === totalPages"
      @click="change(currentPage + 1)"
    >
      <ChevronRight :size="16" />
    </Button>

    <!-- jump end -->

    <Button
      class="mobile-edge"
      variant="link"
      :disabled="disabled || currentPage === totalPages"
      @click="change(totalPages)"
    >
      <ChevronsRight :size="16" />
    </Button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.pagination.disabled {
  opacity: 0.45;
  pointer-events: none;
}

.pagination :deep(.btn) {
  width: 46px;
  height: 36px;
  justify-content: center;
  flex-shrink: 0;
}

.pagination :deep(.btn svg) {
  margin: 0 auto;
}

.dots {
  padding: 6px;
  color: var(--text-muted);
}

.active {
  background: var(--primary);
  color: var(--text);
}

/* desktop */

.pages {
  display: flex;
  gap: 8px;
}

/* mobile */

.mobile-info {
  display: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  align-items: baseline;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  touch-action: none;
}

.current {
  font-size: 18px;
  color: var(--primary);
}

.divider {
  opacity: 0.5;
}

.total {
  opacity: 0.6;
}

.mobile-edge {
  display: none;
}

/* responsive */

@media (max-width: 640px) {
  .pages {
    display: none;
  }

  .mobile-info {
    display: flex;
  }

  .mobile-edge {
    display: flex;
  }

  .pagination :deep(.btn) {
    width: 38px;
  }
}
</style>
