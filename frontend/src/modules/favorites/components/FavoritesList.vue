<script setup lang="ts">
import { useFavoritesStore } from '../store/favorites.store';
import FavoritesListItem from './FavoritesListItem.vue';

const store = useFavoritesStore();
</script>

<template>
  <div class="favorites-list">
    <FavoritesListItem v-for="job in store.items" :key="job.id" :job="job" />

    <div v-if="store.loadingMore" class="loading">Загрузка...</div>
  </div>
</template>

<style scoped>
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
