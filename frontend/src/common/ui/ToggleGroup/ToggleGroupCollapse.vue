<script setup lang="ts" generic="T extends string | number">
import { Minus, Plus } from 'lucide-vue-next';
import { computed, inject, provide, ref } from 'vue';

import type { ToggleCollapseContext, ToggleGroupContext } from './toggleGroup.context';

import Button from '../Button.vue';
import { toggleCollapseKey, toggleGroupKey } from './toggleGroup.context';

const props = withDefaults(
  defineProps<{
    limit?: number;
  }>(),
  {
    limit: 5
  }
);

const group = inject<ToggleGroupContext<T>>(toggleGroupKey);

if (!group) {
  throw new Error('ToggleGroupCollapse must be used inside ToggleGroup');
}

const expanded = ref(false);

const items = computed(() => group.items.value);
const selected = computed(() => group.selected.value);

/* selected first */

const sorted = computed(() => {
  const selectedItems: T[] = [];
  const rest: T[] = [];

  for (const v of items.value) {
    if (selected.value.has(v)) selectedItems.push(v);
    else rest.push(v);
  }

  return [...selectedItems, ...rest];
});

const visible = computed(() => {
  if (expanded.value) return sorted.value;

  const selectedCount = selected.value.size;

  if (selectedCount > props.limit) {
    return sorted.value.slice(0, selectedCount);
  }

  const remaining = props.limit - selectedCount;

  return [
    ...sorted.value.slice(0, selectedCount),
    ...sorted.value.slice(selectedCount, selectedCount + remaining)
  ];
});

const visibleSet = computed(() => new Set(visible.value));

const orderMap = computed(() => {
  const map = new Map<T, number>();

  visible.value.forEach((v, i) => {
    map.set(v, i);
  });

  return map;
});

const canCollapse = computed(() => items.value.length > props.limit);

function toggle() {
  expanded.value = !expanded.value;
}

const context: ToggleCollapseContext<T> = {
  visibleSet,
  orderMap,
  expanded
};

provide(toggleCollapseKey, context);
</script>

<template>
  <div class="collapse">
    <Button v-if="canCollapse" size="sm" variant="primary" class="toggle" @click="toggle">
      <component :is="expanded ? Minus : Plus" :size="16" />
    </Button>

    <slot />
  </div>
</template>

<style scoped>
.collapse {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: var(--bg-soft);
  padding: 8px;
  border-radius: 8px;
}

.toggle {
  position: sticky;
  top: -6px;
}
</style>
