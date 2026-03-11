<script setup lang="ts">
import { useRouter } from 'vue-router';

import ButtonGroup from '@/common/ui/ButtonGroup.vue';

import { SETTINGS_GROUPS } from '../config/settings.config';
import SettingsItem from './SettingsItem.vue';

const router = useRouter();

function open(to: string) {
  router.push(to);
}
</script>

<template>
  <div class="settings">
    <ButtonGroup v-for="(group, index) in SETTINGS_GROUPS" :key="index" class="group">
      <SettingsItem
        v-for="item in group"
        :key="item.to"
        :title="item.title"
        :icon="item.icon"
        @click="open(item.to)"
      />
    </ButtonGroup>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
