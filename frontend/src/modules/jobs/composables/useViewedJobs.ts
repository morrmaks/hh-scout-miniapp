import { ref } from 'vue';

const KEY = 'viewed-jobs';

const viewed = ref<Set<string>>(load());

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);

    const arr = raw ? (JSON.parse(raw) as string[]) : [];

    return new Set(arr);
  } catch {
    return new Set<string>();
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify([...viewed.value]));
}

export function useViewedJobs() {
  function markViewed(id: string) {
    if (viewed.value.has(id)) return;

    viewed.value.add(id);
    save();
  }

  function isViewed(id: string) {
    return viewed.value.has(id);
  }

  return {
    viewed,
    markViewed,
    isViewed
  };
}
