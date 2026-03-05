import type { Router, RouteRecordRaw } from 'vue-router';

import { createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/index.vue')
  }
  // {
  //   path: '/favorites',
  //   component: () => import('@/pages/favorites/index.vue')
  // },
  // {
  //   path: '/job/:id',
  //   component: () => import('@/pages/job/[id].vue')
  // }
];

export const router: Router = createRouter({
  history: createWebHistory(),
  routes
});
