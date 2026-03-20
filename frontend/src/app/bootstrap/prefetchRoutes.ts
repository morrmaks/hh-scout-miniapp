import type { Router } from 'vue-router';

import { setLoaderProgress } from './appLoader';

type LazyComponent = () => Promise<unknown>;

function isLazyComponent(component: unknown): component is LazyComponent {
  return typeof component === 'function';
}

export async function prefetchRoutes(router: Router) {
  const routes = router.getRoutes().filter((r) => r.components?.default);

  const loaders = routes.map((r) => r.components?.default).filter(isLazyComponent);

  const total = loaders.length || 1;
  let loaded = 0;

  const wrapped = loaders.map((loader) =>
    loader().then((res) => {
      loaded++;

      const percent = 35 + (loaded / total) * 55;
      setLoaderProgress(percent);

      return res;
    })
  );

  await Promise.all(wrapped);
}
