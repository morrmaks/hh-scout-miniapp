import type { InjectionKey, Ref } from 'vue';

export interface DialogContext {
  open: Ref<boolean>;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

export const DialogContextKey: InjectionKey<DialogContext> = Symbol('dialog');
