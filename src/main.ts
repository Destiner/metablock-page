import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import App from './App.vue';
import Main from './pages/Main.vue';
import Mev from './pages/Mev.vue';

const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', component: Main },
    { path: '/tools/mev', component: Mev },
  ],
});

const head = createHead();

const app = createApp(App);

app.use(router);
app.use(head);

app.mount('#app');

export { routerHistory, router };
