<script setup lang="ts">
import Drawer from '@/common/ui/Drawer.vue';

import { useFavoritesStore } from '../../store/favorites.store';
import FavoritesFilters from './FavoritesFilters.vue';

interface Props {
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const store = useFavoritesStore();

function apply(filters: any) {
  store.setFilters(filters);
  emit('update:open', false);
}
</script>

<template>
  <Drawer :open="open" @update:open="emit('update:open', $event)">
    <FavoritesFilters :model-value="store.filters" @apply="apply" />
  </Drawer>
</template>
