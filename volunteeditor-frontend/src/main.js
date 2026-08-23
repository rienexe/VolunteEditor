import '@/assets/styles/main.scss';
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

import { createApp } from 'vue';
import App from './App.vue';
import index from './router/index.js';

const app = createApp(App);
app.use(index);
app.mount('#app');