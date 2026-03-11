import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { TAB_ORDER } from '@/common/config/tabs';

export function usePageTransition() {
  const router = useRouter();
  const route = useRoute();

  const transitionName = ref('fade');
  const appear = ref(true);

  let previousTab = route.meta.tab as string;
  let previousPosition = window.history.state?.position ?? 0;

  onMounted(() => {
    requestAnimationFrame(() => {
      appear.value = false;
    });
  });

  router.beforeEach((to) => {
    const newTab = to.meta.tab as string;
    const position = window.history.state?.position ?? previousPosition;

    if (newTab !== previousTab) {
      const newIndex = TAB_ORDER.indexOf(newTab);
      const oldIndex = TAB_ORDER.indexOf(previousTab);

      transitionName.value = newIndex > oldIndex ? 'slide-left' : 'slide-right';

      previousTab = newTab;
      previousPosition = position;
      return;
    }

    transitionName.value = position > previousPosition ? 'slide-left' : 'slide-right';

    previousPosition = position;
  });

  return {
    transitionName,
    appear
  };
}
