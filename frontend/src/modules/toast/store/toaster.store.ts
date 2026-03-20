import { ref } from 'vue';

import type { Toast } from '../types/toaster.types';

const toasts = ref<Toast[]>([]);

let id = 0;

export const useToasterStore = () => {
  const close = (id: number) => {
    const toast = toasts.value.find((t) => t.id === id);
    if (!toast || toast.state === 'closing') return;

    toast.state = 'closing';

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 250);
  };

  const add = (toast: Omit<Toast, 'id' | 'state'>) => {
    const item: Toast = {
      id: ++id,
      duration: 4000,
      position: 'bottom-right',
      variant: 'default',
      state: 'open',
      ...toast
    };

    toasts.value.unshift(item);

    const samePosition = toasts.value.filter(
      (t) => (t.position || 'bottom-right') === item.position && t.state !== 'closing'
    );

    if (samePosition.length > 3) {
      const oldest = samePosition.at(-1);
      if (oldest) close(oldest.id);
    }

    if (item.duration) {
      setTimeout(close, item.duration, item.id);
    }
  };

  return {
    toasts,
    add,
    close
  };
};
