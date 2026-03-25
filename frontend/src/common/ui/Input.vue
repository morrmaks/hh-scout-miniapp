<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { computed, ref, useAttrs } from 'vue';

import Button from './Button.vue';

interface Props {
  disabled?: boolean;
  modelValue?: string;
  placeholder?: string;
  type?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  type: 'text'
});

const emit = defineEmits<{
  'update:modelValue': [string];
  enter: [];
}>();

const attrs = useAttrs();

const inputRef = ref<HTMLInputElement | null>(null);

const value = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v)
});

const showClear = computed(() => !!value.value && !props.disabled);

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
});

function clear() {
  value.value = '';
  requestAnimationFrame(() => {
    inputRef.value?.focus();
  });
}

const onEnter = () => {
  emit('enter');
  inputRef.value?.blur();
};
</script>

<template>
  <div class="input-wrap">
    <input
      ref="inputRef"
      v-model="value"
      class="input"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      v-bind="attrs"
      @keydown.enter.prevent="onEnter"
    >

    <!-- 🔥 крестик -->
    <Button v-if="showClear" variant="link" class="clear-btn" @mousedown.prevent="clear">
      <X :size="16" />
    </Button>
  </div>
</template>

<style scoped>
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
}

.input {
  min-width: 0;
  flex: 1;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 32px 10px 14px;
  font-size: 14px;
  color: var(--text);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow:
    0 0 0 1px var(--primary),
    0 0 14px var(--primary-hover);
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

@media (hover: none) and (pointer: coarse) {
  .input {
    font-size: 16px;
  }
}
</style>
