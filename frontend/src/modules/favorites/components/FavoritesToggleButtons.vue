<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { computed } from 'vue';

import { isPending } from '@/common/lib/optimistic';
import Button from '@/common/ui/Button.vue';
import ButtonGroup from '@/common/ui/ButtonGroup.vue';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/ui/Tooltip';
import { ResumeCreateLink, useResumesStore } from '@/modules/resumes';

import { useFavoritesStore } from '../store/favorites.store';
import FavoritesSaveDropdown from './FavoritesSaveDropdown.vue';

interface Props {
  jobId: string;
}

const props = defineProps<Props>();

const resumes = useResumesStore();
const favorites = useFavoritesStore();

const isLoading = computed(() => isPending('favorites', props.jobId));
const isFavorite = computed(() => favorites.ids.has(props.jobId));
const disabled = computed(() => !resumes.hasResumes);

function toggle() {
  favorites.toggleFavorite(props.jobId);
}
</script>

<template>
  <Tooltip :close-delay="700" :disabled="!disabled">
    <TooltipTrigger>
      <ButtonGroup orientation="horizontal">
        <Button
          class="favorite-button"
          size="xs"
          variant="link"
          :disabled="isLoading || disabled"
          @click.stop="toggle"
        >
          <Star :size="16" :class="{ active: isFavorite, loading: isLoading }" />
        </Button>
        <FavoritesSaveDropdown :job-id :disabled="disabled" />
      </ButtonGroup>
    </TooltipTrigger>
    <TooltipContent>
      <div class="tooltip-resume">
        Перед сохранением вакансий,
        <ResumeCreateLink label="создайте резюме" class="resume-create-link" />
      </div>
    </TooltipContent>
  </Tooltip>
</template>

<style scoped>
.favorite-button {
  padding: 4px 8px;
}

.favorite-button svg {
  color: var(--text-muted);
  transition: all 0.15s ease;
}

.favorite-button svg.active {
  color: #f59e0b;
  fill: #f59e0b;
}

.favorite-button svg.loading {
  opacity: 0.6;
}

.tooltip-resume {
  max-width: 200px;
}

.resume-create-link {
  display: inline-flex;
  padding: 0;
  height: auto;
}
</style>
