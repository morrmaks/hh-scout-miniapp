<script setup lang="ts">
interface Props {
  size?: 'lg' | 'md' | 'sm';
  variant?: 'destructive' | 'ghost' | 'link' | 'primary';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
});
</script>

<template>
  <button type="button" class="btn" :class="[variant, size]" v-bind="$attrs">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border: none;
  border-radius: 8px;

  font-size: 14px;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  transition: all 0.2s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn:disabled:hover {
  box-shadow: none;
}

.sm {
  padding: 6px 12px;
}

.md {
  padding: 8px 14px;
}

.lg {
  padding: 10px 16px;
}

/* PRIMARY */

.primary {
  background: var(--primary);
  color: white;

  box-shadow: 0 0 0 transparent;
}

.primary:hover {
  background: var(--primary-hover);
  box-shadow:
    0 0 8px var(--primary-glow),
    0 0 14px var(--primary-glow-soft);
}

.primary:disabled:hover {
  background: var(--primary);
  box-shadow: none;
}

/* GHOST */

.ghost {
  background: var(--button-bg);
  color: var(--text);
}

.ghost:hover {
  background: var(--button-hover);
  box-shadow: 0 0 8px var(--button-glow);
}

.ghost:disabled:hover {
  background: var(--button-bg);
  box-shadow: none;
}

/* DESTRUCTIVE */

.destructive {
  background: var(--destructive);
  color: var(--text);
}

.destructive:hover {
  background: var(--destructive-hover);
  box-shadow:
    0 0 8px var(--destructive-glow),
    0 0 14px var(--destructive-glow-soft);
}

.destructive:disabled:hover {
  background: var(--destructive);
  box-shadow: none;
}

.link {
  background: transparent;
  color: var(--text);
}

.link:hover {
  opacity: 0.6;
}

.link:disabled:hover {
  opacity: 1;
}
</style>
