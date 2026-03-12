<script setup lang="ts">
import { ref } from 'vue';

import {
  FavoritesFiltersDrawer,
  FavoritesFiltersToggle,
  FavoritesList,
  useStatusesStore
} from '@/modules/favorites';

const filtersOpen = ref(false);

const statuses = useStatusesStore();

statuses.init();
</script>

<template>
  <div class="favorites-page">
    <FavoritesFiltersToggle :open="filtersOpen" @toggle="filtersOpen = !filtersOpen" />
    <FavoritesFiltersDrawer v-model:open="filtersOpen" />
    <FavoritesList />
  </div>
</template>

<style scoped>
.favorites-page {
  display: flex;
  flex-direction: column;

  gap: 16px;
}
</style>
