<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { ROUTES } from '@/common/constants/routes';
import { ResumeSelector, useResumesStore } from '@/modules/resumes';

const resumes = useResumesStore();

const route = useRoute();

const title = computed(() => route.meta.title ?? '');
</script>

<template>
  <header class="header">
    <div class="container header-content">
      <h1 class="header-title">
        {{ title }}
      </h1>
      <ResumeSelector v-if="route.path === ROUTES.FAVORITES && resumes.items.length" />
    </div>
  </header>
</template>

<style scoped>
.header {
  background: transparent;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 12px;
}

.header-title {
  display: flex;
  align-items: center;
  height: 48px;
  font-size: 24px;
  font-weight: 900;
}

@media (max-width: 640px) {
  .header-content {
    padding: 16px 16px 8px;
  }

  .header-title {
    height: 36px;
    font-size: 20px;
  }
}
</style>
