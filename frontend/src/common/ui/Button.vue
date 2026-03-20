<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  type: 'button',
  active: false
});

interface Props {
  active?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  type?: 'button' | 'reset' | 'submit';
  variant?: 'destructive' | 'ghost' | 'link' | 'outline' | 'primary';
}

const attrs = useAttrs();

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  { 'is-active': props.active }
]);
</script>

<template>
  <button
    :type="props.type"
    :class="classes"
    :aria-pressed="props.active || undefined"
    v-bind="attrs"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s,
    border-color 0.15s,
    opacity 0.15s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn :deep(svg) {
  flex-shrink: 0;
}

/* sizes */

.btn-xs {
  padding: 4px 8px;
}

.btn-sm {
  padding: 6px 12px;
}

.btn-md {
  padding: 8px 14px;
}

.btn-lg {
  padding: 10px 16px;
}

/* primary */

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

/* ghost */

.btn-ghost {
  background: var(--button-bg);
  color: var(--text);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--button-hover);
}

.btn-ghost.is-active {
  background: var(--primary);
  color: #fff;
}

.btn-ghost.is-active:hover:not(:disabled) {
  background: var(--primary-hover);
}

/* outline */

.btn-outline {
  background: var(--button-bg-soft);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-outline:hover:not(:disabled) {
  background: var(--button-hover);
}

.btn-outline.is-active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.btn-outline.is-active:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

/* destructive */

.btn-destructive {
  background: var(--button-destructive-bg);
  color: #fff;
}

.btn-destructive:hover:not(:disabled) {
  background: var(--button-destructive-bg-hover);
}

/* link */

.btn-link {
  border-radius: 0;
  background: transparent;
  color: var(--text);
}

.btn-link:hover:not(:disabled) {
  color: var(--text-muted);
}
</style>
