<script setup lang="ts">
import Skeleton from './Skeleton.vue';
</script>

<template>
  <div class="pagination">
    <Skeleton width="46px" height="36px" radius="8px" />

    <Skeleton width="46px" height="36px" radius="8px" />
    <Skeleton width="46px" height="36px" radius="8px" />
    <Skeleton width="46px" height="36px" radius="8px" />

    <Skeleton width="46px" height="36px" radius="8px" />
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;

  gap: 8px;
  margin-top: 24px;
}
</style>
