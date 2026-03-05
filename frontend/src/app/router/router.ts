import type { Router, RouteRecordRaw } from 'vue-router';

import { createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [];

export const router: Router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
