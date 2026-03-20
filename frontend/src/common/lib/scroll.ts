const SCROLL_REGEX = /auto|scroll/;

export function getScrollParents(el: HTMLElement | null): HTMLElement[] {
  const parents: HTMLElement[] = [];

  let parent = el?.parentElement;

  while (parent) {
    const style = getComputedStyle(parent);

    const overflow = style.overflow + style.overflowY + style.overflowX;

    if (SCROLL_REGEX.test(overflow)) {
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  parents.push(document.body);

  return parents;
}
