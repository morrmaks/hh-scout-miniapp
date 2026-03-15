<script setup lang="ts">
import { EllipsisVerticalIcon } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/common/ui/Dropdown';
</script>

<template>
  <Dropdown>
    <DropdownTrigger as-child>
      <Button variant="outline" class="toolbar-actions">
        <EllipsisVerticalIcon :size="14" />
      </Button>
    </DropdownTrigger>
    <DropdownContent>
      <DropdownItem variant="success" class="favorites-export"> Экспорт в XLCX </DropdownItem>
      <DropdownItem variant="destructive" class="favorites-clean">
        Очистить избранное
      </DropdownItem>
    </DropdownContent>
  </Dropdown>
</template>

<style scoped>
.toolbar-actions {
  padding: 9px 14px;
}

.favorites-export {
  color: var(--text);
}
</style>
