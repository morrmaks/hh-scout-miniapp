<script setup lang="ts">
import { SlidersHorizontal } from 'lucide-vue-next';
import { ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import { Drawer, DrawerContent, DrawerTrigger } from '@/common/ui/Drawer';

import type { FavoritesFiltersType } from '../../types/favorites.types';

import { useFavoritesStore } from '../../store/favorites.store';
import FavoritesFilters from './FavoritesFilters.vue';

const store = useFavoritesStore();

const open = ref(false);

function reset() {
  open.value = false;
}

function apply(filters: FavoritesFiltersType) {
  store.setFilters(filters);
  open.value = false;
}
</script>
<template>
  <Drawer v-model:open="open">
    <DrawerTrigger>
      <Button variant="outline" class="toggle-button">
        <SlidersHorizontal :size="14" />
      </Button>
    </DrawerTrigger>

    <DrawerContent>
      <FavoritesFilters @apply="apply" @reset="reset" />
    </DrawerContent>
  </Drawer>
</template>

<style scoped>
.toggle-button {
  padding: 9px 14px;
}
</style>
