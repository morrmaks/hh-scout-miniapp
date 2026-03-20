<script setup lang="ts">
import Card from '@/common/ui/Card.vue';
import Skeleton from '@/common/ui/Skeleton.vue';
</script>

<template>
  <Card class="favorite-card">
    <div class="left">
      <div class="title-row">
        <Skeleton width="16px" height="18px" radius="4px" />

        <Skeleton width="70%" height="21px" />
      </div>

      <Skeleton width="40%" height="18px" />

      <div class="meta">
        <Skeleton width="80px" height="20px" radius="999px" />
      </div>
    </div>

    <div class="right">
      <Skeleton width="20px" height="20px" radius="4px" />

      <Skeleton width="100px" height="26px" radius="999px" />
    </div>
  </Card>
</template>

<style scoped>
.favorite-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;

  padding: 12px;
}

.left {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta {
  margin-top: auto;

  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  min-width: 120px;
}
</style>
