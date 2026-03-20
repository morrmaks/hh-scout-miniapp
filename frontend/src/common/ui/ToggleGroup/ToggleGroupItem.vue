<script setup lang="ts" generic="T extends string | number">
import { computed, inject, onMounted } from 'vue';

import type { ToggleCollapseContext, ToggleGroupContext } from './toggleGroup.context';

import Button from '../Button.vue';
import { toggleCollapseKey, toggleGroupKey } from './toggleGroup.context';

const props = withDefaults(
  defineProps<{
    value: T;
    variant?: 'ghost' | 'outline';
    asChild?: boolean;
  }>(),
  {
    asChild: false
  }
);

const group = inject<ToggleGroupContext<T>>(toggleGroupKey);
const collapse = inject<ToggleCollapseContext<T> | null>(toggleCollapseKey, null);

if (!group) {
  throw new Error('ToggleGroupItem must be used inside ToggleGroup');
}

onMounted(() => {
  group.register(props.value);
});

const active = computed(() => group.selected.value.has(props.value));

const visible = computed(() => {
  if (!collapse) return true;
  return collapse.visibleSet.value.has(props.value);
});

const order = computed(() => {
  if (!collapse) return 0;
  return collapse.orderMap.value.get(props.value) ?? 999;
});

function click() {
  group?.toggle(props.value);
}

const component = computed(() => (props.asChild ? 'span' : Button));
</script>

<template>
  <component
    :is="component"
    v-if="visible"
    :size="!asChild ? 'sm' : undefined"
    :variant="!asChild ? (variant ?? 'ghost') : undefined"
    :active="!asChild ? active : undefined"
    :style="{ order }"
    @click="click"
  >
    <slot :active="active" />
  </component>
</template>
