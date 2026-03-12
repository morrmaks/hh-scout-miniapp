<script setup lang="ts">
import FavoritesListItemSkeleton from './FavoritesListItemSkeleton.vue';

withDefaults(
  defineProps<{
    count?: number;
  }>(),
  {
    count: 3
  }
);
</script>

<template>
  <div class="favorites-list">
    <FavoritesListItemSkeleton v-for="i in count" :key="i" />
  </div>
</template>

<style scoped>
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
