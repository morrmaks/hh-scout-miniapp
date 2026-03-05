<script setup lang="ts">
import Pagination from '@/common/ui/Pagination.vue';

interface Props {
  page: number;
  pages: number;
}

defineProps<Props>();

defineEmits<{
  change: [number];
}>();
</script>

<template>
  <Pagination :current-page="page" :total-pages="pages" @change="$emit('change', $event)" />
</template>
