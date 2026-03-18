import type { InjectionKey, Ref } from 'vue';

export interface TooltipContext {
  contentRef: Ref<HTMLElement | null>;
  disabled: boolean;

  open: Ref<boolean>;
  triggerRef: Ref<HTMLElement | null>;

  closeTooltip: () => void;
  forceClose: () => void;
  isMobile: () => boolean;
  openTooltip: () => void;

  toggleMobile: () => void;
}

export const tooltipKey: InjectionKey<TooltipContext> = Symbol('tooltip');
