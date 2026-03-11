<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import type { Area } from '@/common/api/generated';

import Button from '@/common/ui/Button.vue';

interface Props {
  areas: Area[];
  modelValue?: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [string[]];
}>();

const expanded = ref(false);

const selectedSet = computed(() => new Set(props.modelValue ?? []));

const visibleAreas = computed(() => {
  const selected: Area[] = [];
  const rest: Area[] = [];

  for (const area of props.areas) {
    if (selectedSet.value.has(area.id)) {
      selected.push(area);
    } else {
      rest.push(area);
    }
  }

  if (expanded.value) {
    return [...selected, ...rest];
  }

  if (selected.length > 5) {
    return selected;
  }

  const limit = 5 - selected.length;

  return [...selected, ...rest.slice(0, limit)];
});

function toggle(id: string) {
  const set = new Set(props.modelValue ?? []);

  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }

  emit('update:modelValue', [...set]);
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div class="areas">
    <Button
      v-if="areas.length > 5"
      size="sm"
      variant="primary"
      class="toggle"
      @click="toggleExpanded"
    >
      <component :is="expanded ? Minus : Plus" :size="16" />
    </Button>

    <Button
      v-for="area in visibleAreas"
      :key="area.id"
      size="sm"
      variant="ghost"
      :active="selectedSet.has(area.id)"
      @click="toggle(area.id)"
    >
      {{ area.name }}
    </Button>
  </div>
</template>

<style scoped>
.toggle {
  position: sticky;
  top: -6px;
}

.areas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: var(--bg-soft);
  padding: 8px;
  border-radius: 8px;
}
</style>
