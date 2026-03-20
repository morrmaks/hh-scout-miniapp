<script setup lang="ts">
interface Props {
  active?: boolean;
  icon?: any;
  label: string;
}

defineProps<Props>();
</script>

<template>
  <button class="item" :class="{ active }">
    <div class="indicator" />

    <component :is="icon" v-if="icon" class="icon" :size="20" />

    <span class="label">
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.item {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 2px;

  border: none;
  background: transparent;

  color: var(--text-muted);

  padding-top: 6px;
}

/* индикатор */

.indicator {
  width: 26px;
  height: 3px;

  border-radius: 999px;

  background: transparent;

  transition: background-color 0.2s;
}

.item.active .indicator {
  background: var(--primary);
}

/* icon */

.icon {
  margin-top: 8px;
  opacity: 0.9;
}

/* label */

.label {
  font-size: 11px;
  font-weight: 500;
}

.item.active {
  color: var(--primary);
}

.item.active .label {
  font-weight: 600;
}

@media (max-width: 640px) {
  .icon {
    margin-top: 6px;
  }
}
</style>
