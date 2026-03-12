import type { Ref } from 'vue';

import { watch } from 'vue';

import { getScrollParents } from '../lib/scroll';

export function useLockScrollParents(target: Ref<HTMLElement | null>, active: Ref<boolean>) {
  let parents: HTMLElement[] = [];
  const original = new Map<HTMLElement, string>();

  function lock() {
    parents = getScrollParents(target.value);

    parents.forEach((el) => {
      original.set(el, el.style.overflow);
      el.style.overflow = 'hidden';
    });
  }

  function unlock() {
    parents.forEach((el) => {
      el.style.overflow = original.get(el) ?? '';
    });

    parents = [];
    original.clear();
  }

  watch(active, (v) => {
    if (v) lock();
    else unlock();
  });
}
