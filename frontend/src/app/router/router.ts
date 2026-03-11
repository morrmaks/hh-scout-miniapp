import type { Router, RouteRecordRaw } from 'vue-router';

import { Heart, Search, Settings } from 'lucide-vue-next';
import { createRouter, createWebHistory } from 'vue-router';

import { ROUTES } from '@/common/constants/routes';

const routes: RouteRecordRaw[] = [
  {
    path: ROUTES.MAIN,
    component: () => import('@/pages/index.vue'),
    meta: {
      title: 'Поиск',
      tab: 'search',
      nav: {
        label: 'Поиск',
        icon: Search,
        order: 2
      }
    }
  },
  {
    path: ROUTES.FAVORITES,
    component: () => import('@/pages/favorites/index.vue'),
    meta: {
      title: 'Избранное',
      tab: 'favorites',
      nav: {
        label: 'Избранное',
        icon: Heart,
        order: 1
      }
    }
  },
  {
    path: ROUTES.SETTINGS.MAIN,
    component: () => import('@/pages/settings/index.vue'),
    meta: {
      title: 'Настройки',
      tab: 'settings',
      nav: {
        label: 'Настройки',
        icon: Settings,
        order: 3
      }
    }
  },
  {
    path: ROUTES.SETTINGS.THEME,
    component: () => import('@/pages/settings/theme/index.vue'),
    meta: {
      title: 'Оформление',
      tab: 'settings'
    }
  }
];

export const router: Router = createRouter({
  history: createWebHistory(),
  routes
});
