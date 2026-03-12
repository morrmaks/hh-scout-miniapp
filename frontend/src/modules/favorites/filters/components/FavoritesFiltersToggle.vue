<script setup lang="ts">
import { ChevronDown, SlidersHorizontal, X } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';

import { useFavoritesStore } from '../../store/favorites.store';

interface Props {
  open: boolean;
}

defineProps<Props>();

defineEmits<{
  toggle: [];
}>();

const store = useFavoritesStore();
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
</style>
