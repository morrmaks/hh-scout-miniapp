<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

import { ROUTES } from '@/common/constants/routes';
import Button from '@/common/ui/Button.vue';

const props = defineProps<{
  label?: string;
}>();

const router = useRouter();

function go() {
  router.push(ROUTES.SETTINGS.RESUMES);
}
</script>

<template>
  <Button variant="link" size="xs" class="resume-create-link" @click="go">
    {{ props.label ?? 'Создать резюме' }}
    <ExternalLink :size="12" :stroke-width="2.2" />
  </Button>
</template>

<style scoped>
.resume-create-link {
  position: relative;
}

/* линия */
.resume-create-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;

  width: 100%;
  height: 1.5px;

  background-color: var(--text-muted);

  transform: scaleX(0);
  transform-origin: left;

  transition: transform 0.2s ease;
}

/* hover */
.resume-create-link:hover::after {
  transform: scaleX(1);
}
</style>
