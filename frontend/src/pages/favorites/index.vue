<script setup lang="ts">
import Spinner from '@/common/ui/Spinner.vue';
import { FavoritesFiltersRow, FavoritesList, FavoritesSearch } from '@/modules/favorites';
import { ResumeCreateLink, useResumesStore } from '@/modules/resumes';

const resumes = useResumesStore();
</script>

<template>
  <div class="favorites-page">
    <div v-if="resumes.isLoading" class="favorites-spinner">
      <Spinner variant="bars" stroke-width="4" />
    </div>
    <div v-else-if="!resumes.hasResumes" class="favorites-empty">
      <ResumeCreateLink class="empty-title" label="Создайте резюме" />
      <p class="empty-subtitle">
        Избранные вакансии сохраняются в конкретные резюме. Создайте его, чтобы добавлять вакансии и
        устанавливать статусы.
      </p>
    </div>
    <template v-else>
      <FavoritesSearch />
      <FavoritesFiltersRow />
      <FavoritesList />
    </template>
  </div>
</template>

<style scoped>
.favorites-page {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.favorites-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.favorites-empty {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  gap: 8px;
  padding: 32px 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
}

.empty-title :deep(svg) {
  stroke-width: 3;
  width: 14px;
  height: 14px;
}
</style>
