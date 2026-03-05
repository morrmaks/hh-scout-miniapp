import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = []

export const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

export default router