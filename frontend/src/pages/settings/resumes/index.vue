<script setup lang="ts">
import { ResumeManager } from '@/modules/resumes';
</script>

<template>
  <div class="resumes-page">
    <ResumeManager />
  </div>
</template>

<style scoped>
.resumes-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
