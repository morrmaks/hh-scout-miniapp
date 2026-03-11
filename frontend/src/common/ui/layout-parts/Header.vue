<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Button from '../Button.vue';

const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title ?? '');

const canGoBack = computed(() => route.path !== '/');

function back() {
  if (window.history.length > 1) router.back();
  else router.replace('/');
}
</script>

<template>
  <header class="header">
    <div class="container header-content">
      <Button v-if="canGoBack" variant="link" @click="back">
        <ArrowLeft :size="20" />
      </Button>

      <h1 class="title">
        {{ title }}
      </h1>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: transparent;
}

.header-content {
  display: flex;
  align-items: center;
  padding: 20px 16px 12px;
}

/* кнопка назад */

.title {
  display: flex;
  align-items: center;
  height: 48px;
  font-size: 24px;
  font-weight: 900;
}

@media (max-width: 640px) {
  .header-content {
    padding: 16px 16px 8px;
  }

  .title {
    height: 36px;
    font-size: 20px;
  }
}
</style>
