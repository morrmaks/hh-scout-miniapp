<script setup lang="ts">
import {
  FavoritesFiltersRow,
  FavoritesList,
  FavoritesSearch,
  useStatusesStore
} from '@/modules/favorites';

const statuses = useStatusesStore();

statuses.init();
</script>

<template>
  <div class="favorites-page">
    <FavoritesSearch />
    <FavoritesFiltersRow />
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
