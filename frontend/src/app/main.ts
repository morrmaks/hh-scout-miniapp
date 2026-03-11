import { createApp } from 'vue';

import App from './App.vue';
import { setLoaderProgress, startAppLoader, stopAppLoader } from './bootstrap/appLoader';
import { prefetchRoutes } from './bootstrap/prefetchRoutes';
import { setupProviders } from './providers/providers';
import { router } from './router/router';

async function bootstrap() {
  startAppLoader();

  const app = createApp(App);

  app.use(router);

  await setupProviders(app);

  setLoaderProgress(35);

  await router.isReady();

  await prefetchRoutes(router);

  setLoaderProgress(90);

  app.mount('#app');

  stopAppLoader();
}

bootstrap();
