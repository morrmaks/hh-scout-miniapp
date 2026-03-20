import type { InjectionKey, Ref } from 'vue';

export interface DrawerContext {
  open: Ref<boolean>;
  setOpen: (value: boolean) => void;
  toggle: () => void;
}

export const DrawerContextKey: InjectionKey<DrawerContext> = Symbol('drawer');
