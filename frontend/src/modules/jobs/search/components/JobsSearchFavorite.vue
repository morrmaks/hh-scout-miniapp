<script setup lang="ts">
import { X } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';
import ScrollFade from '@/common/ui/ScrollFade.vue';

import { useSearchFavorite } from '../composables/useSearchFavorite';

const emit = defineEmits<{
  select: [string];
}>();

const { history, remove } = useSearchFavorite();

function select(q: string) {
  emit('select', q);
}

function removeQuery(e: MouseEvent, q: string) {
  e.stopPropagation();
  remove(q);
}
</script>

<template>
  <ScrollFade v-if="history.length">
    <Button v-for="q in history" :key="q" size="sm" variant="ghost" class="chip" @click="select(q)">
      {{ q }}

      <span class="search-favorite-remove" @click="removeQuery($event, q)">
        <X :size="12" />
      </span>
    </Button>
  </ScrollFade>
</template>

<style scoped>
.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  white-space: nowrap;
}

.search-favorite-remove {
  display: flex;
  align-items: center;
  opacity: 0.6;
}

.search-favorite-remove:hover {
  opacity: 1;
}
</style>
