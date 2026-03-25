<script setup lang="ts">
import { SlidersHorizontal } from 'lucide-vue-next';
import { ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import { Drawer, DrawerContent, DrawerTrigger } from '@/common/ui/Drawer';

import type { JobsFiltersType } from '../../types/jobs.types';

import { useJobsStore } from '../../store/jobs.store';
import JobsFilters from './JobsFilters.vue';

const store = useJobsStore();

const open = ref(false);

function reset() {
  open.value = false;
}

function apply(filters: JobsFiltersType) {
  store.setFilters(filters);
  open.value = false;
}
</script>

<template>
  <Drawer v-model:open="open">
    <DrawerTrigger style="display: flex; align-self: stretch; height: auto">
      <Button variant="outline" class="toggle-button">
        <SlidersHorizontal :size="14" />
      </Button>
    </DrawerTrigger>

    <DrawerContent scroll="inner">
      <JobsFilters @apply="apply" @reset="reset" />
    </DrawerContent>
  </Drawer>
</template>

<style scoped>
.toggle-button {
  padding: 8px 14px;
  height: 100%;
}

.toggle-button svg {
  height: 16px;
}
</style>
