<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import Input from '@/common/ui/Input.vue';

import { useFavoritesStore } from '../store/favorites.store';

const store = useFavoritesStore();

const query = ref(store.query);

function submit() {
  store.setQuery(query.value);
}
</script>

<template>
  <div class="search">
    <Input v-model="query" placeholder="Название или URL вакансии..." @enter="submit" />

    <Button class="search-submit" @click="submit">
      <Search :size="16" />
      <span>Поиск</span>
    </Button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .search-submit :deep(span) {
    display: none;
  }

  .search :deep(svg) {
    width: 14px;
    height: 14px;
  }
}
</style>
