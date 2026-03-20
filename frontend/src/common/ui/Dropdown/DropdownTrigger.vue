<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { inject, onMounted, ref } from 'vue';

import Button from '../Button.vue';
import { dropdownKey } from './dropdown.context';

interface Props {
  asChild?: boolean;
}

defineProps<Props>();

const dropdown = inject(dropdownKey)!;

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
  <!-- custom trigger -->
  <span v-if="asChild" ref="el" class="anchor" @click="!dropdown.disabled && dropdown.toggle()">
    <slot />
  </span>

  <!-- default trigger -->
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

    <ChevronDown class="chevron" :size="14" />
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

.chevron {
  transition: transform 0.2s ease;
}

.trigger[data-state='open'] .chevron {
  transform: rotate(180deg);
}

.anchor {
  display: inline-block;
}
</style>
