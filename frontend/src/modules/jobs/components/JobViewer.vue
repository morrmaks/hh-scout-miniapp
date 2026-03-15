<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { ArrowLeft, ArrowRight, ExternalLink, MapPin } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import type { Job } from '@/common/api/generated';

import Badge from '@/common/ui/Badge.vue';
import Button from '@/common/ui/Button.vue';
import Card from '@/common/ui/Card.vue';
import { formatDate } from '@/common/utils/date';
import { FavoritesToggleButton } from '@/modules/favorites';

import { useViewedJobs } from '../composables/useViewedJobs';

interface Props {
  disableNext?: boolean;
  disablePrev?: boolean;
  job: Job | null;
  position: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  prev: [];
  next: [];
}>();

const expanded = ref(false);

const { isViewed } = useViewedJobs();

const SKILLS_LIMIT = 6;

const visibleSkills = computed(() => {
  if (!props.job?.skills) return [];
  return props.job.skills.slice(0, SKILLS_LIMIT);
});

const hiddenSkillsCount = computed(() => {
  if (!props.job?.skills) return 0;
  return Math.max(props.job.skills.length - SKILLS_LIMIT, 0);
});

const meta = computed(() => {
  if (!props.job) return [];

  return [
    props.job.workSchedule?.length && `График: ${props.job.workSchedule.join(', ')}`,
    props.job.employmentForm && `Занятость: ${props.job.employmentForm}`,
    props.job.workFormat?.length && `Формат: ${props.job.workFormat.join(', ')}`,
    props.job.workingHours?.length && `Часы: ${props.job.workingHours.join(', ')}`
  ].filter((v): v is string => Boolean(v));
});

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
  if (e.key === 'ArrowRight' && !props.disableNext) emit('next');
  if (e.key === 'ArrowLeft' && !props.disablePrev) emit('prev');
});
</script>

<template>
  <Card v-if="job" class="viewer" :class="{ expanded }">
    <span v-if="!isViewed(job.id)" class="viewed" />
    <span class="public-date" v-text="formatDate(job.publishedAt ?? '')" />
    <span class="position" v-text="position" />

    <header class="header">
      <div class="title-row">
        <h2 class="title" v-text="job.title" />

        <a :href="job.url" target="_blank">
          <Button variant="link" size="xs">
            <ExternalLink :size="12" />
          </Button>
        </a>
      </div>

      <div class="info-row">
        <div class="left">
          <p class="company" v-text="job.company" />

          <div v-if="job.city" class="meta">
            <MapPin :size="12" />
            {{ job.city }}
          </div>
        </div>

        <div class="right">
          <div v-if="job.experience" class="muted" v-text="job.experience" />

          <div v-if="job.salaryFrom || job.salaryTo" class="muted">
            {{ job.salaryFrom ?? 0 }}
            {{ job.salaryTo ? ` - ${job.salaryTo}` : '' }}
            {{ job.currency ?? '' }}
          </div>
        </div>
      </div>
    </header>

    <Button v-if="meta.length" variant="link" size="sm" class="more" @click="expanded = !expanded">
      {{ expanded ? 'Скрыть детали' : 'Подробнее' }}
    </Button>

    <div v-if="expanded" class="meta-grid">
      <div class="meta-grid-details">
        <div v-for="m in meta" :key="m">
          {{ m }}
        </div>
      </div>

      <div v-if="job.skills?.length" class="skills">
        <Badge v-for="skill in visibleSkills" :key="skill">
          {{ skill }}
        </Badge>
        <Badge v-if="hiddenSkillsCount"> +{{ hiddenSkillsCount }} </Badge>
      </div>
    </div>

    <article v-if="job.description" class="description">
      {{ job.description }}
    </article>

    <div class="nav">
      <Button variant="ghost" :disabled="disablePrev" @click="$emit('prev')">
        <ArrowLeft :size="16" />
      </Button>

      <FavoritesToggleButton class="favorite" :job-id="job.id" />

      <Button variant="ghost" :disabled="disableNext" @click="$emit('next')">
        <ArrowRight :size="16" />
      </Button>
    </div>
  </Card>
</template>

<style scoped>
.viewer {
  position: relative;
  height: 80vh;
  transition: height 0.2s ease;
  --card-padding: clamp(16px, 3vw, 24px);
  border-radius: 18px;
}

.viewer.expanded {
  height: 110vh;
}

/* HEADER */

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-row {
  display: flex;
  justify-content: start;
  align-items: flex-start;
}

.title {
  font-size: 22px;
  font-weight: 600;
}

/* MARKERS */

.viewed {
  position: absolute;

  height: 20px;
  width: 20px;

  top: 0;
  left: 0;

  border-radius: 18px 0 6px 0;

  background: var(--primary);
}

.public-date {
  position: absolute;

  top: 4px;
  left: 50%;
  transform: translateX(-50%);

  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.position {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 0 18px 0 6px;
  background: var(--bg-soft);
  color: var(--text-muted);
}

/* INFO */

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  text-align: right;
}

.company {
  color: var(--text-muted);
}

.meta {
  color: var(--text-muted);
}

.muted {
  color: var(--text-muted);
}

/* DETAILS */

.more {
  font-size: 14px;
  margin-top: 8px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  align-self: flex-start;
}

.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-grid-details {
  display: flex;
  flex-direction: column;
  gap: 8px;

  font-size: 14px;
  color: var(--text-muted);
}

/* SKILLS */

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--bg-soft);
}

/* DESCRIPTION */

.description {
  flex: 1;

  white-space: pre-line;

  overflow-y: auto;

  font-size: clamp(14px, 2.5vw, 15px);
  line-height: 1.6;

  background: var(--bg-soft);

  padding: 16px;

  border-radius: 10px;
}

/* NAV */

.nav {
  display: flex;
  justify-content: center;
  gap: 48px;
}

.favorite {
  margin-left: 1px;
}

/* MOBILE */

@media (max-width: 640px) {
  .viewer {
    --card-padding: 24px 8px 8px;
  }

  .title {
    font-size: 16px;
  }

  .info-row {
    flex-direction: column;
    gap: 6px;
  }

  .left {
    font-size: 12px;
  }

  .right {
    text-align: left;
    font-size: 12px;
  }

  .description {
    font-size: 13px;
  }

  .meta-grid-details {
    gap: 6px;
    font-size: 12px;
  }
}
</style>
