<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { computed } from 'vue';

import { isPending } from '@/common/lib/optimistic';
import Button from '@/common/ui/Button.vue';

import { useFavoritesStore } from '../store/favorites.store';

interface Props {
  jobId: string;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 16
});

const favorites = useFavoritesStore();

const isLoading = computed(() => isPending('favorites', props.jobId));
const isFavorite = computed(() => favorites.ids.has(props.jobId));

function toggle() {
  favorites.toggleFavorite(props.jobId);
}
</script>

<template>
  <Button
    class="favorite-button"
    size="xs"
    variant="link"
    :disabled="isLoading"
    @click.stop="toggle"
  >
    <Star :size="size" :class="{ active: isFavorite, loading: isLoading }" />
  </Button>
</template>

<style scoped>
.favorite-button {
  padding: 4px;
}

.favorite-button svg {
  color: var(--text-muted);
  transition: all 0.15s ease;
}

.favorite-button svg.active {
  color: #f59e0b;
  fill: #f59e0b;
  transform: scale(1.15);
}

.favorite-button svg.loading {
  opacity: 0.6;
  transform: scale(0.9);
}
</style>
