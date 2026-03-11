<script setup lang="ts">
import { onMounted } from 'vue';

import { useTelegramStore } from '@/app/integrations/telegram';
import { FavoritesList, useFavoritesStore } from '@/modules/favorites';

const favoritesStore = useFavoritesStore();
const telegramStore = useTelegramStore();

onMounted(() => {
  if (!telegramStore.user) return;
  favoritesStore.fetchFavorites(telegramStore.user.id);
});
</script>

<template>
  <FavoritesList />
</template>
