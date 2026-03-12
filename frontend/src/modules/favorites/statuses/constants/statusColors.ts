import type { StatusColor } from '@/common/api/generated';

export const STATUS_COLORS: StatusColor[] = [
  'blue',
  'purple',
  'orange',
  'green',
  'red',
  'yellow',
  'pink',
  'teal',
  'indigo',
  'gray'
] as const;

export const STATUS_COLOR_MAP: Record<StatusColor, string> = {
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  pink: '#ec4899',
  teal: '#14b8a6',
  indigo: '#6366f1',
  gray: '#6b7280'
};
