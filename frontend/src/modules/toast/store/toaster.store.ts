import { ref } from 'vue';

import type { Toast } from '../types/toaster.types';

const toasts = ref<Toast[]>([]);

let id = 0;

export const useToasterStore = () => {
  const timers = new Map<number, ReturnType<typeof setTimeout>>();

  const close = (id: number) => {
    const toast = toasts.value.find((t) => t.id === id);
    if (!toast || toast.state === 'closing') return;

    toast.state = 'closing';

    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }

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

    if (item.duration) {
      const timer = setTimeout(close, item.duration, item.id);
      timers.set(item.id, timer);
    }

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

    return item.id;
  };

  const update = (id: number, patch: Partial<Toast>) => {
    const toast = toasts.value.find((t) => t.id === id);
    if (!toast) return;

    Object.assign(toast, patch);

    if (patch.duration !== undefined) {
      const old = timers.get(id);
      if (old) clearTimeout(old);

      if (patch.duration) {
        const timer = setTimeout(close, patch.duration, id);
        timers.set(id, timer);
      }
    }
  };

  return {
    toasts,
    add,
    close,
    update
  };
};
