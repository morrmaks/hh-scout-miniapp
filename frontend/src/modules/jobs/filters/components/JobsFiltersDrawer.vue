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
    <DrawerTrigger>
      <Button variant="outline" class="toggle-button">
        <SlidersHorizontal :size="14" />
      </Button>
    </DrawerTrigger>

    <DrawerContent>
      <JobsFilters @apply="apply" @reset="reset" />
    </DrawerContent>
  </Drawer>
</template>

<style scoped>
.toggle-button {
  padding: 9px 14px;
}
</style>
