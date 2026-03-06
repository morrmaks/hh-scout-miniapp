<script setup lang="ts">
import { ArrowLeft, ArrowRight, ExternalLink, MapPin } from 'lucide-vue-next';
import { ref } from 'vue';

import type { Job } from '@/common/api/generated';

import Button from '@/common/ui/Button.vue';
import { useViewedJobs } from '@/modules/jobs/composables/useViewedJobs';

interface Props {
  disableNext?: boolean;
  disablePrev?: boolean;
  job: Job | null;
  position: string;
}

defineProps<Props>();

defineEmits<{
  prev: [];
  next: [];
}>();

const expanded = ref(false);

const { isViewed } = useViewedJobs();
</script>

<template>
  <div v-if="job" class="viewer">
    <span v-if="!isViewed(job.id)" class="viewed" />

    <div class="position">
      {{ position }}
    </div>

    <header class="header">
      <div class="title-row">
        <h2 class="title">
          {{ job.title }}
        </h2>
        <a :href="job.url" target="_blank">
          <Button variant="link" size="sm">
            <ExternalLink :size="12" />
          </Button>
        </a>
      </div>

      <div class="info-row">
        <div class="left">
          <p class="company">
            {{ job.company }}
          </p>

          <div v-if="job.city" class="meta"><MapPin :size="12" /> {{ job.city }}</div>
        </div>

        <div class="right">
          <div v-if="job.experience" class="muted">
            {{ job.experience }}
          </div>

          <div v-if="job.salaryFrom || job.salaryTo" class="muted">
            {{ job.salaryFrom ?? 0 }}
            {{ job.salaryTo ? ` - ${job.salaryTo}` : '' }}
            {{ job.currency ?? '' }}
          </div>
        </div>
      </div>
    </header>

    <button
      v-if="job.schedule || job.employment || job.workFormat || job.workingHours"
      class="more"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Скрыть детали' : 'Подробнее' }}
    </button>

    <div v-if="expanded" class="meta-grid">
      <div class="meta-grid-details">
        <div v-if="job.schedule">График: {{ job.schedule }}</div>

        <div v-if="job.employment">Занятость: {{ job.employment }}</div>

        <div v-if="job.workFormat">Формат: {{ job.workFormat }}</div>

        <div v-if="job.workingHours">Рабочие часы: {{ job.workingHours }}</div>
      </div>

      <div v-if="job.skills?.length" class="skills">
        <span v-for="skill in job.skills" :key="skill" class="skill">
          {{ skill }}
        </span>
      </div>
    </div>

    <article v-if="job.description" class="description" v-html="job.description" />

    <div class="nav">
      <Button variant="ghost" :disabled="disablePrev" @click="$emit('prev')">
        <ArrowLeft :size="16" />
      </Button>

      <Button variant="ghost" :disabled="disableNext" @click="$emit('next')">
        <ArrowRight :size="16" />
      </Button>
    </div>
  </div>

  <div v-else class="empty">Начните искать вакансии</div>
</template>

<style scoped>
.viewer {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;

  padding: clamp(16px, 3vw, 24px);

  display: flex;
  flex-direction: column;

  height: 80vh;

  gap: 16px;
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
  gap: 4px;
}

.title {
  font-size: clamp(18px, 2.5vw, 22px);
  font-weight: 600;
}

.viewed {
  position: absolute;
  height: 20px;
  width: 20px;
  top: 0;
  left: 0;

  border-bottom-right-radius: 6px;
  border-top-left-radius: 14px;

  background: var(--primary);
}

.position {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  font-weight: 600;

  padding: 2px 8px;

  border-bottom-left-radius: 6px;
  border-top-right-radius: 14px;

  background: var(--bg-soft);
  color: var(--text-muted);

  white-space: nowrap;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
}

.company {
  font-size: 14px;
  color: var(--text-muted);
}

.meta {
  font-size: 13px;
  color: var(--text-muted);
}

.muted {
  font-size: 13px;
  color: var(--text-muted);
}

/* DETAILS */

.more {
  font-size: 13px;

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
  gap: 10px;
}

/* EMPTY */

.empty {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

/* MOBILE */

@media (max-width: 640px) {
  .viewer {
    padding: 24px 8px 8px;
  }

  .info-row {
    flex-direction: column;
    gap: 6px;
  }

  .right {
    text-align: left;
  }

  .description {
    font-size: 12px;
  }
}
</style>
