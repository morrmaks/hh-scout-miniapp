import type { SearchHistoryItem } from '../types/search.types';

import {
  CURRENCY_CONFIG,
  EMPLOYMENT_CONFIG,
  EXPERIENCE_CONFIG,
  ORDER_CONFIG,
  PERIOD_CONFIG,
  WORK_FORMAT_CONFIG
} from '../../filters';

export function formatHistoryFilters(item: SearchHistoryItem, areaMap?: Map<string, string>) {
  const f = item.filters;
  const parts: string[] = [];

  if (f.experience?.length) {
    parts.push(f.experience.map((v) => EXPERIENCE_CONFIG[v] ?? v).join(', '));
  }

  if (f.employment_form?.length) {
    parts.push(f.employment_form.map((v) => EMPLOYMENT_CONFIG[v] ?? v).join(', '));
  }

  if (f.work_format?.length) {
    parts.push(f.work_format.map((v) => WORK_FORMAT_CONFIG[v] ?? v).join(', '));
  }

  if (f.area?.length) {
    parts.push(...f.area.map((id) => areaMap?.get(id) ?? id));
  }

  if (f.label?.length) {
    const labelMap: Record<string, string> = {
      with_salary: 'Указан доход'
    };

    parts.push(f.label.map((l) => labelMap[l] ?? l).join(', '));
  }

  if (f.salary) {
    const currency = f.currency ? (CURRENCY_CONFIG[f.currency]?.label ?? f.currency) : '';

    parts.push(`от ${f.salary}${currency ? ` ${currency}` : ''}`);
  }

  if (f.period) {
    const label = PERIOD_CONFIG[f.period];
    if (label) parts.push(label);
  }

  if (item.orderBy !== 'relevance') {
    const label = ORDER_CONFIG[item.orderBy];
    if (label) parts.push(label);
  }

  return parts;
}
