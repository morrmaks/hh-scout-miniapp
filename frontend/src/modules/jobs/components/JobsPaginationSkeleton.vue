<script setup lang="ts">
import Skeleton from '@/common/ui/Skeleton.vue';
</script>

<template>
  <div class="pagination">
    <Skeleton width="46px" height="36px" radius="8px" color="glow" />

    <Skeleton width="46px" height="36px" radius="8px" color="glow" />
    <Skeleton width="46px" height="36px" radius="8px" color="glow" />
    <Skeleton width="46px" height="36px" radius="8px" color="glow" />

    <Skeleton width="46px" height="36px" radius="8px" color="glow" />
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
