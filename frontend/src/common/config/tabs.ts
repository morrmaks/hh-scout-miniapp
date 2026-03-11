import { router } from '@/app/router/router';
import { hasNav } from '@/common/utils/router';

export const TAB_ORDER = router
  .getRoutes()
  .filter(hasNav)
  .sort((a, b) => a.meta.nav.order - b.meta.nav.order)
  .map((r) => r.meta.tab as string);
