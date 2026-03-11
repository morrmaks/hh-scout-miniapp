<script setup lang="ts">
import { PALETTES_UI } from '../constants/palettes';
import { useThemeStore } from '../store/theme.store';

const store = useThemeStore();
</script>

<template>
  <div class="palettes">
    <button
      v-for="p in PALETTES_UI"
      :key="p.id"
      class="palette"
      :class="{ active: store.palette === p.id }"
      :style="{ background: p.color }"
      @click="store.setPalette(p.id)"
    />
  </div>
</template>

<style scoped>
.palettes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.palette {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}

.palette.active {
  border-color: var(--text);
}
</style>
