<script setup lang="ts">
import Skeleton from '@/common/ui/Skeleton.vue';
</script>

<template>
  <div class="item">
    <Skeleton class="input" :height="39" />
    <Skeleton :width="30" :height="30" />
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input {
  flex: 1;
  min-width: 0;
}
</style>
