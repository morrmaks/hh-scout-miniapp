import type { LucideProps } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';

import { Palette } from 'lucide-vue-next';

import { ROUTES } from '@/common/constants/routes';

export interface SettingsItemConfig {
  icon: FunctionalComponent<LucideProps>;
  title: string;
  to: string;
}

export type SettingsGroupConfig = SettingsItemConfig[];

export const SETTINGS_GROUPS: SettingsGroupConfig[] = [
  [
    {
      title: 'Тема',
      icon: Palette,
      to: ROUTES.SETTINGS.THEME
    }
  ]
];
