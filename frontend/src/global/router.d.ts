import type { LucideProps } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';

declare module 'vue-router' {
  interface RouteMeta {
    nav?: {
      label: string;
      icon: FunctionalComponent<LucideProps>;
      order: number;
    };
    tab?: string;
    title?: string;
  }
}
