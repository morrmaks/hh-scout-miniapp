import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getTelegram } from '@/app/integrations/telegram';

export function useTelegramNavigation() {
  const route = useRoute();
  const router = useRouter();
  const tg = getTelegram();

  if (!tg) return;

  tg.BackButton.onClick(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace('/');
  });

  watch(
    () => route.path,
    (path) => {
      if (path === '/') {
        tg.BackButton.hide();
      } else {
        tg.BackButton.show();
      }
    },
    { immediate: true }
  );
}
