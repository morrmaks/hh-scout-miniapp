import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useTelegramStore } from '@/app/integrations/telegram';
import { dbGet, dbSet } from '@/common/lib/indexedDb';

import type { ThemeMode, ThemePalette } from '../types/theme.types';

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('system');
  const palette = ref<ThemePalette>('orange');

  const { scheme } = useTelegramStore();

  function resolveScheme(): 'dark' | 'light' {
    if (mode.value === 'system') return scheme;
    console.log('theme', mode.value);

    return mode.value;
  }

  function applyTheme() {
    const scheme = resolveScheme();
    document.documentElement.dataset.theme = `${scheme}-${palette.value}`;
  }

  async function init() {
    const savedMode = await dbGet<ThemeMode>('theme-mode');
    const savedPalette = await dbGet<ThemePalette>('theme-palette');

    if (savedMode) mode.value = savedMode;
    if (savedPalette) palette.value = savedPalette;

    applyTheme();
  }

  async function setMode(value: ThemeMode) {
    mode.value = value;
    await dbSet('theme-mode', value);

    applyTheme();
  }

  async function setPalette(value: ThemePalette) {
    palette.value = value;
    await dbSet('theme-palette', value);

    applyTheme();
  }

  return {
    mode,
    palette,
    init,
    setMode,
    setPalette,
    applyTheme
  };
});
