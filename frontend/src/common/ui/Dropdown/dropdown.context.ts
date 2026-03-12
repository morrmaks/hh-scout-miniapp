import type { InjectionKey, Ref } from 'vue';

export interface DropdownContext {
  contentRef: Ref<HTMLElement | null>;
  open: Ref<boolean>;
  triggerRef: Ref<HTMLElement | null>;
  close: () => void;
  toggle: () => void;
}

export const dropdownKey: InjectionKey<DropdownContext> = Symbol('dropdown');
