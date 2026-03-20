<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

interface Props {
  disabled?: boolean;
  label?: string;
  modelValue?: boolean;
}

const attrs = useAttrs();

const checked = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
});
</script>

<template>
  <label class="checkbox" :class="{ disabled }" v-bind="attrs">
    <input v-model="checked" type="checkbox" :disabled="disabled" aria-hidden="true">

    <span class="box">
      <Check :class="{ hidden: !checked }" :size="12" />
    </span>

    <span v-if="label" class="text">
      {{ label }}
    </span>
  </label>
</template>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.checkbox.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.box {
  width: 18px;
  height: 18px;
  border: 1px solid var(--border);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: white;
  line-height: 0;
  transition:
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.box :deep(svg) {
  display: block;
}

.hidden {
  opacity: 0;
}

.checkbox input:checked + .box {
  background: var(--primary);
  border-color: var(--primary);
}

.text {
  font-size: 14px;
  color: var(--text);
}
</style>
