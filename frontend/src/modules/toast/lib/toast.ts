import type { ToastPosition, ToastVariant } from '../types/toaster.types';

import { useToasterStore } from '../store/toaster.store';

interface Options {
  duration?: number;
  position?: ToastPosition;
  title?: string;
}

const show = (message: string, variant: ToastVariant, options?: Options) => {
  const { add } = useToasterStore();

  add({
    message,
    variant,
    ...options
  });
};

export const toast = {
  success(message: string, options?: Options) {
    show(message, 'success', {
      position: 'top-center',
      ...options
    });
  },

  error(message: string, options?: Options) {
    show(message, 'error', options);
  },

  warning(message: string, options?: Options) {
    show(message, 'warning', options);
  },

  default(message: string, options?: Options) {
    show(message, 'default', options);
  }
};
