<script setup lang="ts">
import { useAttrs } from 'vue';

import PrimitiveSlot from './PrimitiveSlot.vue';

interface Props {
  as?: object | string;
  asChild?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  asChild: false
});

const attrs = useAttrs();
</script>

<template>
  <PrimitiveSlot v-if="props.asChild" v-bind="attrs">
    <slot />
  </PrimitiveSlot>

  <component :is="props.as" v-else v-bind="attrs">
    <slot />
  </component>
</template>
