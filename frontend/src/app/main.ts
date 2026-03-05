import { createApp } from 'vue';

import App from './App.vue';
import { pinia } from './providers/pinia';
import router from './router/router';

import './styles/reset.css';
import './styles/global.css';

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
