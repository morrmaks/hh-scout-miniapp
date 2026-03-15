<script setup lang="ts">
import { computed } from 'vue';

import Select from '@/common/ui/Select.vue';

import FavoritesActionsDropdown from '../../components/FavoritesActionsDropdown.vue';
import { useFavoritesStore } from '../../store/favorites.store';
import { sortOptions } from '../config/favoritesFilters.options';
import FavoritesFiltersDrawer from './FavoritesFiltersDrawer.vue';

const store = useFavoritesStore();

const sort = computed({
  get: () => store.sort,
  set: store.setSort
});
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-filters">
      <FavoritesFiltersDrawer />
      <Select v-model="sort" :options="sortOptions" />
    </div>

    <FavoritesActionsDropdown />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.toolbar-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-actions {
  padding: 9px 14px;
}
</style>
