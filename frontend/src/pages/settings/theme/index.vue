<script setup lang="ts">
import Card from '@/common/ui/Card.vue';
import { ThemeModeSwitcher, ThemePaletteSwitcher } from '@/modules/theme';
</script>

<template>
  <div class="theme-page">
    <Card class="theme-card">
      <div class="theme-card-header">
        <h2>Режим темы</h2>
      </div>

      <ThemeModeSwitcher class="theme-mode-switcher" />
    </Card>

    <Card>
      <div class="theme-card-header">
        <h2>Цвет интерфейса</h2>
      </div>

      <ThemePaletteSwitcher />
    </Card>
  </div>
</template>

<style scoped>
.theme-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.theme-card {
  --card-padding: 16px 12px;
}

.theme-mode-switcher {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

/* заголовок карточки */

.theme-card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-card-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.theme-card-header p {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
