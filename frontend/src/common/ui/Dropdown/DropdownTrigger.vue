<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { inject, onMounted, ref, useAttrs } from 'vue';

import Button from '../Button.vue';
import { dropdownKey } from './dropdown.context';

interface Props {
  asChild?: boolean;
}

defineOptions({ inheritAttrs: false });
defineProps<Props>();
const dropdown = inject(dropdownKey)!;
const attrs = useAttrs();

const el = ref<HTMLElement | null>(null);

function getElement(el: any): HTMLElement | null {
  return el?.$el ?? el;
}

onMounted(() => {
  const element = getElement(el.value);
  if (!element) return;

  dropdown.triggerRef.value = element;
});
</script>

<template>
  <span
    v-if="asChild"
    ref="el"
    class="anchor"
    v-bind="attrs"
    :data-state="dropdown.open.value ? 'open' : 'closed'"
    @click="!dropdown.disabled && !dropdown.open.value && dropdown.toggle()"
  >
    <slot />
  </span>

  <Button
    v-else
    ref="el"
    variant="outline"
    class="trigger"
    type="button"
    :disabled="dropdown.disabled"
    :data-state="dropdown.open.value ? 'open' : 'closed'"
    @click="dropdown.toggle"
  >
    <span class="content">
      <slot />
    </span>

    <ChevronDown class="dropdown-trigger-chevron" :size="14" />
  </Button>
</template>

<style scoped>
.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-trigger-chevron {
  transition: transform 0.2s ease;
}

.trigger[data-state='open'] .dropdown-trigger-chevron {
  transform: rotate(180deg);
}

.anchor {
  display: inline-block;
}

.anchor[data-state='open'] :deep(.dropdown-trigger-chevron) {
  transform: rotate(180deg);
}
</style>
