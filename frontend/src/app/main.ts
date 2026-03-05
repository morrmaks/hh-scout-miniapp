import { createApp } from 'vue';

import App from './App.vue';
import { setupProviders } from './providers';
import { router } from './router';

import './styles/reset.css';
import './styles/global.css';

const app = createApp(App);

app.use(router);
setupProviders(app);

app.mount('#app');
