import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { Resume } from '@/common/api/generated';

import { deleteResumeById, getResumes, postResumes } from '@/common/api/generated';

import { useActiveResume } from '../composables/useActiveResume';
import { useDefaultSaveResumes } from '../composables/useDefaultSaveResumes';

export const useResumesStore = defineStore('resumes', () => {
  const items = ref<Resume[]>([]);
  const activeResumeId = ref<number | null>(null);
  const defaultSaveResumeIds = ref<number[]>([]);

  const activeResumeDb = useActiveResume();
  const defaultSaveDb = useDefaultSaveResumes();

  const activeResume = computed(
    () => items.value.find((r) => r.id === activeResumeId.value) ?? null
  );

  const hasResumes = computed(() => items.value.length > 0);

  async function init() {
    const [{ data }, active, defaults] = await Promise.all([
      getResumes(),
      activeResumeDb.restore(),
      defaultSaveDb.restore()
    ]);

    items.value = data;

    if (active && data.some((r) => r.id === active)) activeResumeId.value = active;
    else if (data.length) activeResumeId.value = data[0]?.id ?? null;

    if (defaults)
      defaultSaveResumeIds.value = defaults.filter((id) => data.some((r) => r.id === id));
    else if (data.length && data[0]?.id) defaultSaveResumeIds.value = [data[0].id];
  }

  async function createResume(name: string) {
    const { data } = await postResumes({
      body: { name }
    });

    items.value.push(data);

    activeResumeId.value = data.id;

    defaultSaveResumeIds.value.push(data.id);

    return data;
  }

  async function removeResume(id: number) {
    const wasActive = activeResumeId.value === id;

    await deleteResumeById({ path: { id } });

    items.value = items.value.filter((r) => r.id !== id);

    defaultSaveResumeIds.value = defaultSaveResumeIds.value.filter((r) => r !== id);

    if (wasActive) activeResumeId.value = items.value[0]?.id ?? null;

    return { wasActive };
  }

  async function updateResume(id: number, name: string) {
    // 🔴 пока заглушка
    // потом заменишь на API
    const item = items.value.find((r) => r.id === id);
    if (!item) return;

    item.name = name;
  }

  /* ---------------- ui actions ---------------- */

  function setActiveResume(id: number) {
    activeResumeId.value = id;
  }

  function toggleDefaultSaveResume(id: number) {
    const set = new Set(defaultSaveResumeIds.value);

    if (set.has(id)) set.delete(id);
    else set.add(id);

    defaultSaveResumeIds.value = Array.from(set);
  }

  function setDefaultSaveResumes(ids: number[]) {
    defaultSaveResumeIds.value = [...ids];
  }

  /* ---------------- persistence ---------------- */

  watch(activeResumeId, (v) => activeResumeDb.save(v));

  watch(defaultSaveResumeIds, (v) => defaultSaveDb.save(v), { deep: true });

  /* ---------------- exports ---------------- */

  return {
    /* state */
    items,
    activeResumeId,
    defaultSaveResumeIds,

    /* computed */
    activeResume,
    hasResumes,

    /* lifecycle */
    init,

    /* server */
    createResume,
    removeResume,
    updateResume,

    /* ui */
    setActiveResume,
    toggleDefaultSaveResume,
    setDefaultSaveResumes
  };
});
