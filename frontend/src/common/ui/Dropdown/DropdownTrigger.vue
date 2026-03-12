<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { inject, onMounted, ref } from 'vue';

import Button from '../Button.vue';
import { dropdownKey } from './dropdown.context';

interface Props {
  asChild?: boolean;
}

defineProps<Props>();
defineSlots<{
  default: (props: { toggle: () => void; open: boolean }) => any;
}>();

const dropdown = inject(dropdownKey)!;

const el = ref<HTMLElement>();

onMounted(() => {
  if (!el.value) return;
  dropdown.triggerRef.value = el.value instanceof HTMLElement ? el.value : (el.value as any).$el;
});
</script>

<template>
  <span v-if="asChild" ref="el" class="anchor">
    <slot :toggle="dropdown.toggle" :open="dropdown.open.value" />
  </span>

  <Button
    v-else
    ref="el"
    variant="outline"
    class="trigger"
    type="button"
    :data-state="dropdown.open.value ? 'open' : 'closed'"
    @click="dropdown.toggle"
  >
    <span class="content">
      <slot :toggle="dropdown.toggle" :open="dropdown.open.value" />
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
