<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical';
}

withDefaults(defineProps<Props>(), {
  orientation: 'vertical'
});
</script>

<template>
  <div class="group" :class="orientation">
    <slot />
  </div>
</template>

<style scoped>
.group {
  display: flex;

  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;

  background: var(--card);
}

.group.vertical {
  flex-direction: column;
}

.group.horizontal {
  flex-direction: row;
}

.group.vertical > :not(:first-child) {
  border-top: 1px solid var(--border);
}

.group.horizontal > :not(:first-child) {
  border-left: 1px solid var(--border);
}

.group :deep(*) {
  border-radius: 0 !important;
}
</style>
