<template>
  <div class="spinner" />
</template>

<style scoped>
.spinner {
  width: 32px;
  height: 32px;

  border: 4px solid #ddd;
  border-top: 4px solid #2563eb;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
