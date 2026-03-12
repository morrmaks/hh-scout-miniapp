import type { ComputedRef, InjectionKey, ShallowRef } from 'vue';

export interface ToggleGroupContext<T> {
  items: ShallowRef<T[]>;
  selected: ComputedRef<Set<T>>;
  register: (value: T) => void;
  toggle: (value: T) => void;
}

export interface ToggleCollapseContext<T> {
  expanded: { value: boolean };
  orderMap: ComputedRef<Map<T, number>>;
  visibleSet: ComputedRef<Set<T>>;
}

export const toggleGroupKey: InjectionKey<ToggleGroupContext<any>> = Symbol('toggleGroup');

export const toggleCollapseKey: InjectionKey<ToggleCollapseContext<any>> = Symbol('toggleCollapse');
