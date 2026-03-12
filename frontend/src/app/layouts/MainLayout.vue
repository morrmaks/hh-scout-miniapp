<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { usePageTransition } from '@/common/composables/usePageTransition';
import BottomNav from '@/common/ui/layout-parts/BottomNav.vue';
import Header from '@/common/ui/layout-parts/Header.vue';
import { useFavoritesStore } from '@/modules/favorites';

const route = useRoute();
const favorites = useFavoritesStore();

const { transitionName, appear } = usePageTransition();

onMounted(() => {
  favorites.fetchIds();
});
</script>

<template>
  <div class="layout">
    <Header />

    <main class="container content">
      <router-view v-slot="{ Component }">
        <Transition :name="transitionName" mode="out-in" :appear="appear">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>

    <BottomNav />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.content {
  --page-padding: 16px;
  flex: 1;
  padding: var(--page-padding);

  position: relative;
  overflow: hidden;
}

/* animation */

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  position: absolute;

  width: calc(100% - var(--page-padding) * 2);

  transition:
    transform 0.25s ease,
    opacity 0.25s ease;

  will-change: transform;
}

/* forward */

.slide-left-enter-from {
  transform: translateX(calc(100% + var(--page-padding)));
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(calc(-100% - var(--page-padding)));
  opacity: 0;
}

/* back */

.slide-right-enter-from {
  transform: translateX(calc(-100% - var(--page-padding)));
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(calc(100% + var(--page-padding)));
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
</style>
