<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import { hasNav } from '@/common/utils/router';

import BottomNavItem from './BottomNavItem.vue';

const router = useRouter();
const route = useRoute();

const tabs = router
  .getRoutes()
  .filter(hasNav)
  .sort((a, b) => a.meta.nav.order - b.meta.nav.order);

function navigate(path: string) {
  if (route.path === path) return;
  router.push(path);
}
</script>

<template>
  <div class="bottom-nav">
    <nav class="container bottom-nav-content">
      <BottomNavItem
        v-for="tab in tabs"
        :key="tab.path"
        :label="tab.meta.nav.label"
        :icon="tab.meta.nav.icon"
        :active="route.meta.tab === tab.meta.tab"
        @click="navigate(tab.path)"
      />
    </nav>
  </div>
</template>

<style scoped>
.bottom-nav {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: var(--card);
  border-top: 1px solid var(--border);
}

.bottom-nav-content {
  display: flex;
  padding: 4px 0 calc(env(safe-area-inset-bottom) + 12px);
}

@media (max-width: 640px) {
  .bottom-nav-content {
    padding: 0 0 calc(env(safe-area-inset-bottom) + 8px);
  }
}
</style>
