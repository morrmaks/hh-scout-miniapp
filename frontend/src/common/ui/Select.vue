<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue';

import Button from './Button.vue';
import Dropdown from './Dropdown/Dropdown.vue';
import DropdownContent from './Dropdown/DropdownContent.vue';
import DropdownItem from './Dropdown/DropdownItem.vue';
import DropdownTrigger from './Dropdown/DropdownTrigger.vue';

interface Option<T> {
  icon?: any;
  label: string;
  value: T;
}

interface Props<T> {
  modelValue?: T;
  options: Option<T>[];
  placeholder?: string;
}

const props = defineProps<Props<T>>();

const emit = defineEmits<{
  'update:modelValue': [T];
}>();

const selected = computed(() => props.options.find((o) => o.value === props.modelValue));

function select(option: Option<T>, close: () => void) {
  emit('update:modelValue', option.value);
  close();
}
</script>

<template>
  <Dropdown class="select">
    <DropdownTrigger>
      <template v-if="selected">
        <component :is="selected.icon" v-if="selected.icon" :size="14" />
        {{ selected.label }}
      </template>

      <span v-else class="placeholder">
        {{ props.placeholder ?? 'Select' }}
      </span>
    </DropdownTrigger>

    <DropdownContent>
      <DropdownItem v-for="o in props.options" :key="o.value" v-slot="{ close }" as-child>
        <Button
          variant="ghost"
          class="option"
          :active="o.value === props.modelValue"
          @click="select(o, close)"
        >
          <component :is="o.icon" v-if="o.icon" :size="14" />

          {{ o.label }}
        </Button>
      </DropdownItem>
    </DropdownContent>
  </Dropdown>
</template>

<style scoped>
.placeholder {
  color: var(--text-muted);
}

.option {
  width: 100%;
  justify-content: start;
}
</style>
