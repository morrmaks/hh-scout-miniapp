<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

interface Props {
  variant?: 'default' | 'muted' | 'primary';
}

const attrs = useAttrs();

const classes = computed(() => ['badge', `badge-${props.variant}`]);
</script>

<template>
  <span :class="classes" v-bind="attrs">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  border-radius: 6px;
  white-space: nowrap;
  user-select: none;
}

/* default */

.badge-default {
  background: var(--bg-soft);
  color: var(--text);
}

/* muted */

.badge-muted {
  background: var(--bg-soft);
  color: var(--text-muted);
}

/* primary */

.badge-primary {
  background: var(--primary);
  color: #fff;
}
</style>
