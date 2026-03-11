export type ThemeMode = 'dark' | 'light' | 'system';

export const PALETTES = [
  'orange',
  'indigo',
  'emerald',
  'purple',
  'midnight',
  'crimson',
  'slate'
] as const;

export type ThemePalette = (typeof PALETTES)[number];
