<script setup lang="ts">
interface Props {
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="group">
    <div class="label">
      {{ label }}
    </div>

    <div class="control">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.group {
  display: grid;
  grid-template-columns: 140px 1fr;

  align-items: center;
  gap: 12px;
}

.label {
  font-size: 13px;
  color: var(--text-muted);
}

.control {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* mobile */

@media (max-width: 640px) {
  .group {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
