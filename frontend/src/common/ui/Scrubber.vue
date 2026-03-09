<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

interface Props {
  modelValue: number;
  total: number;
}

const props = defineProps<Props>();

const container = ref<HTMLElement | null>(null);
const current = ref(props.modelValue);

let items: HTMLElement[] = [];

function move(dx: number) {
  const el = container.value;
  if (!el) return;

  el.scrollLeft -= dx;
  updateCurrent();
}

function updateCurrent() {
  const el = container.value;
  if (!el) return;

  const center = el.scrollLeft + el.clientWidth / 2;

  let closest = 1;
  let dist = Infinity;

  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    if (!c) continue;

    const mid = c.offsetLeft + c.offsetWidth / 2;
    const d = Math.abs(mid - center);

    if (d < dist) {
      dist = d;
      closest = i + 1;
    }
  }

  current.value = closest;
}

function scrollToInitial() {
  const el = container.value;
  if (!el) return;

  const child = items[props.modelValue - 1];
  if (!child) return;

  el.scrollLeft = child.offsetLeft - el.clientWidth / 2 + child.clientWidth / 2;
}

onMounted(async () => {
  await nextTick();

  const el = container.value;
  if (!el) return;

  items = Array.from(el.children) as HTMLElement[];

  scrollToInitial();
});

defineExpose({
  move,
  current
});
</script>

<template>
  <div class="overlay">
    <div ref="container" class="numbers">
      <span
        v-for="n in total"
        :key="n"
        class="num"
        :class="{
          active: n === current,
          near: Math.abs(n - current) === 1,
          far: Math.abs(n - current) === 2
        }"
      >
        {{ n }}
      </span>
    </div>

    <div class="marker" />
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 0;
}

.numbers {
  display: flex;
  overflow-x: scroll;
  gap: 20px;
  padding: 0 120px;
  scrollbar-width: none;
}

.numbers::-webkit-scrollbar {
  display: none;
}

.num {
  min-width: 30px;
  text-align: center;
  font-size: 15px;
  color: var(--text-muted);
  transform: scale(0.85);
  opacity: 0.5;
  transition:
    transform 0.18s ease,
    opacity 0.18s ease,
    color 0.18s ease;
}

.num.far {
  transform: scale(0.95);
  opacity: 0.7;
}

.num.near {
  transform: scale(1.1);
  opacity: 0.9;
}

.num.active {
  transform: scale(1.35);
  color: var(--primary);
  font-weight: 600;
  opacity: 1;
}

.marker {
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  transform: translateX(-50%);
}

.overlay::before,
.overlay::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
}

.overlay::before {
  left: 0;
  background: linear-gradient(to right, var(--card), transparent);
}

.overlay::after {
  right: 0;
  background: linear-gradient(to left, var(--card), transparent);
}
</style>
