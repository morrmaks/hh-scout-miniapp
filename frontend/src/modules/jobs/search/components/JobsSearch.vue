<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { Bookmark } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';
import { JobsFiltersDrawer } from '@/modules/jobs/filters';

import { useSearchController } from '../composables/useSearchController';
import JobsSearchDesktop from './JobsSearchDesktop.vue';
import JobsSearchMobile from './JobsSearchMobile.vue';

const isMobile = useMediaQuery('(max-width: 640px)');

const controller = useSearchController();
</script>

<template>
  <div class="search-root">
    <Button variant="outline" class="save-btn" @click="controller.saveFavorite">
      <Bookmark :size="14" />
    </Button>

    <div class="search-trigger">
      <JobsSearchMobile v-if="isMobile" v-bind="controller" />

      <JobsSearchDesktop v-else v-bind="controller" />
    </div>

    <JobsFiltersDrawer />
  </div>
</template>

<style scoped>
.search-root {
  display: flex;
  align-items: stretch;
  gap: 8px;
  width: 100%;
}

.save-btn {
  flex-shrink: 0;
  align-self: stretch;
  height: auto;
}

.search-trigger {
  flex: 1;
  min-width: 0;
}
</style>
