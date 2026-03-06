<script setup lang="ts">
import { X } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';

import { useSearchHistory } from '../composables/useSearchHistory';

const emit = defineEmits<{
  select: [string];
}>();

const { history, remove } = useSearchHistory();

function select(q: string) {
  emit('select', q);
}

function removeQuery(e: MouseEvent, q: string) {
  e.stopPropagation();
  remove(q);
}
</script>

<template>
  <div v-if="history.length" class="history">
    <Button v-for="q in history" :key="q" size="sm" variant="ghost" class="chip" @click="select(q)">
      {{ q }}

      <span class="remove" @click="removeQuery($event, q)">
        <X :size="12" />
      </span>
    </Button>
  </div>
</template>

<style scoped>
.history {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 13px;
}

.remove {
  display: flex;
  align-items: center;

  opacity: 0.6;
}

.remove:hover {
  opacity: 1;
}
</style>
