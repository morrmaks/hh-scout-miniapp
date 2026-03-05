<script setup lang="ts">
interface Props {
  variant?: 'ghost' | 'primary';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary'
});
</script>

<template>
  <button class="btn" :class="variant" v-bind="$attrs">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border: none;
  border-radius: 8px;

  padding: 8px 14px;

  font-size: 14px;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  transition: all 0.2s ease;
}

.primary {
  background: var(--primary);
  color: white;

  box-shadow: 0 0 0 rgba(59, 130, 246, 0);
}

.primary:hover {
  background: var(--primary-hover);

  box-shadow:
    0 0 12px rgba(59, 130, 246, 0.45),
    0 0 22px rgba(59, 130, 246, 0.25);
}

.ghost {
  background: var(--button-bg);
  color: var(--text);
}

.ghost:hover {
  background: var(--button-hover);

  box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
}
</style>
