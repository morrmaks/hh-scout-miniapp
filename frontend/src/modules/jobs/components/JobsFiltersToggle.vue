<script setup lang="ts">
import { ChevronDown, SlidersHorizontal, X } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';

import { useJobsStore } from '../store/jobs.store';

interface Props {
  open: boolean;
}

defineProps<Props>();

defineEmits<{
  toggle: [];
}>();

const store = useJobsStore();
</script>

<template>
  <div class="filters-toggle">
    <Button variant="ghost" @click="$emit('toggle')">
      <SlidersHorizontal :size="16" />
      Фильтры
      <ChevronDown :size="16" class="arrow" :class="{ open }" />
    </Button>

    <Button v-if="store.hasFilters" variant="destructive" @click="store.resetFilters">
      <X :size="14" />
      Сбросить
    </Button>
  </div>
</template>

<style scoped>
.filters-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow {
  transition: transform 0.2s;
}

.arrow.open {
  transform: rotate(180deg);
}

@media (max-width: 640px) {
  .filters-toggle :deep(svg) {
    width: 14px;
    height: 14px;
  }

  .filters-toggle :deep(.btn) {
    gap: 4px;
  }
}
</style>
