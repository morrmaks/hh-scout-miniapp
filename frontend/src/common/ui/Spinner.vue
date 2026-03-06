<template>
  <div class="spinner" />
</template>

<style scoped>
.spinner {
  width: 32px;
  height: 32px;

  border: 4px solid var(--border);
  border-top: 4px solid var(--primary);

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
