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

const visibleAreas = computed(() => {
  const selectedIds = new Set(props.modelValue ?? []);

  const selected = props.areas.filter((a) => selectedIds.has(a.id));

  const base = expanded.value ? props.areas : props.areas.slice(0, 5);

  const map = new Map<string, Area>();

  selected.forEach((a) => map.set(a.id, a));
  base.forEach((a) => map.set(a.id, a));

  return [...map.values()];
});

function toggle(id: string) {
  const current = props.modelValue ?? [];
  const set = new Set(current);

  set.has(id) ? set.delete(id) : set.add(id);

  emit('update:modelValue', [...set]);
}
</script>

<template>
  <div class="areas">
    <Button
      v-if="areas.length > 5"
      size="sm"
      variant="primary"
      class="toggle"
      @click="expanded = !expanded"
    >
      <Minus v-if="expanded" :size="16" />
      <Plus v-if="!expanded" :size="16" />
    </Button>

    <Button
      v-for="area in visibleAreas"
      :key="area.id"
      size="sm"
      variant="ghost"
      class="area"
      :class="{ active: modelValue?.includes(area.id) }"
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
  right: -6px;
}

.areas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  background: var(--bg-soft);
  padding: 8px;

  border-radius: 8px;
}

.area.active {
  background: var(--primary);
  color: white;
}
</style>
