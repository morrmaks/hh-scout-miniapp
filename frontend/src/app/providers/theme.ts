import { useThemeStore } from '@/modules/theme';

export async function setupTheme() {
  const store = useThemeStore();
  await store.init();
}
