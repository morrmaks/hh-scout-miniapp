export function getScrollParents(el: HTMLElement | null): HTMLElement[] {
  const parents: HTMLElement[] = [];

  let parent = el?.parentElement;

  while (parent) {
    const style = getComputedStyle(parent);

    const overflow = style.overflow + style.overflowY + style.overflowX;

    if (/auto|scroll/.test(overflow)) {
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  parents.push(document.body);

  return parents;
}
