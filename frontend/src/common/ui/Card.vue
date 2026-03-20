<script setup lang="ts"></script>

<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: var(--card-padding, 16px);

  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
}
</style>
