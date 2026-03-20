import type { ThemePalette } from '../types/theme.types';

export interface PaletteItem {
  color: string;
  id: ThemePalette;
  name: string;
}

export const PALETTES_UI: readonly PaletteItem[] = [
  { id: 'orange', name: 'Orange', color: '#f97316' },
  { id: 'indigo', name: 'Indigo', color: '#6366f1' },
  { id: 'emerald', name: 'Emerald', color: '#10b981' },
  { id: 'purple', name: 'Purple', color: '#a855f7' },
  { id: 'midnight', name: 'Midnight', color: '#3b82f6' },
  { id: 'crimson', name: 'Crimson', color: '#ef4444' },
  { id: 'slate', name: 'Slate', color: '#22c55e' }
];
