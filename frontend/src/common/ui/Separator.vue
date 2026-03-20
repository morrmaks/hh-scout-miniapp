<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical';
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal'
});
</script>

<template>
  <div class="separator" :class="orientation" role="separator" />
</template>

<style scoped>
.separator {
  background: var(--border);
  flex-shrink: 0;
}

.separator.horizontal {
  width: 100%;
  height: 1px;
}

.separator.vertical {
  width: 1px;
  height: 100%;
}
</style>
