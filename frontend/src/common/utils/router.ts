import type { RouteRecordNormalized } from 'vue-router';

export function hasNav(route: RouteRecordNormalized): route is RouteRecordNormalized & {
  meta: RouteRecordNormalized['meta'] & {
    nav: NonNullable<RouteRecordNormalized['meta']['nav']>;
  };
} {
  return !!route.meta.nav;
}
