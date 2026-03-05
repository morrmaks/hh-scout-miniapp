<script setup lang="ts">
import { computed } from 'vue';

import { buildPagination } from '@/common/utils/pagination';

import Button from './Button.vue';

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
  if (page < 1 || page > props.totalPages) return;

  emit('change', page);
}

const items = computed(() => buildPagination(props.currentPage, props.totalPages, props.window));
</script>

<template>
  <div class="pagination" :class="{ disabled }">
    <Button
      variant="ghost"
      :disabled="disabled || currentPage === 1"
      @click="change(currentPage - 1)"
    >
      ←
    </Button>

    <template v-for="(item, i) in items" :key="i">
      <span v-if="item.type === 'dots'" class="dots"> ... </span>

      <Button
        v-else
        variant="ghost"
        :class="{ active: item.page === currentPage }"
        :disabled="disabled"
        @click="change(item.page)"
      >
        {{ item.page }}
      </Button>
    </template>

    <Button
      variant="ghost"
      :disabled="disabled || currentPage === totalPages"
      @click="change(currentPage + 1)"
    >
      →
    </Button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;

  gap: 8px;
  margin-top: 24px;

  transition: opacity 0.2s;
}

.pagination.disabled {
  opacity: 0.45;
  pointer-events: none;
}

.dots {
  padding: 6px;
  color: var(--text-muted);
}

.active {
  background: var(--primary);
  color: white;
}
</style>
