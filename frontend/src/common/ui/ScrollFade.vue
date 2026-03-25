<script setup lang="ts">
import { ref } from 'vue';

import { useScrollFade } from '../composables/useScrollFade';

const containerRef = ref<HTMLElement | null>(null);

const { showLeft, showRight } = useScrollFade(containerRef);
</script>

<template>
  <div
    class="scroll-fade"
    :class="{
      'is-left': showLeft,
      'is-right': showRight
    }"
  >
    <div ref="containerRef" class="scroll-fade__inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scroll-fade {
  position: relative;
}

.scroll-fade__inner {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.scroll-fade__inner::-webkit-scrollbar {
  display: none;
}

.scroll-fade__inner {
  -webkit-mask-image: none;
  mask-image: none;
}

/* справа */
.scroll-fade.is-right .scroll-fade__inner {
  -webkit-mask-image: linear-gradient(to right, black 85%, transparent);
  mask-image: linear-gradient(to right, black 85%, transparent);
}

/* слева */
.scroll-fade.is-left .scroll-fade__inner {
  -webkit-mask-image: linear-gradient(to left, black 85%, transparent);
  mask-image: linear-gradient(to left, black 85%, transparent);
}

/* с двух сторон */
.scroll-fade.is-left.is-right .scroll-fade__inner {
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
</style>
