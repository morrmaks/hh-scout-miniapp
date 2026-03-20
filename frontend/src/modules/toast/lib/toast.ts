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
  },

  async promise<T>(
    fn: () => Promise<T>,
    options: {
      loading: string;
      success: ((data: T) => string) | string;
      error: string;
    } & Options
  ) {
    const { add, update } = useToasterStore();

    const id = add({
      message: options.loading,
      variant: 'default',
      isLoading: true,
      duration: 0,
      position: options.position,
      title: options.title
    });

    try {
      const data = await fn();

      update(id, {
        message: typeof options.success === 'function' ? options.success(data) : options.success,
        variant: 'success',
        isLoading: false,
        duration: options.duration ?? 4000
      });

      return data;
    } catch (e) {
      update(id, {
        message: options.error,
        variant: 'error',
        isLoading: false,
        duration: 4000
      });

      throw e;
    }
  }
};
