import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { Status, StatusColor } from '@/common/api/generated';

import { useTelegramStore } from '@/app/integrations/telegram';
import {
  deleteStatuseById,
  getStatuses,
  patchStatuseById,
  postStatuses
} from '@/common/api/generated';
import { optimistic } from '@/common/lib/optimistic';

type StatusWithMeta = Status & {
  pending?: boolean;
};

export const useStatusesStore = defineStore('statuses', () => {
  const telegram = useTelegramStore();

  const userId = computed(() => telegram.user?.id ?? null);

  const statuses = ref<StatusWithMeta[]>([]);
  const loading = ref(false);
  const initialized = ref(false);

  const byId = computed(() => Object.fromEntries(statuses.value.map((s) => [s.id, s])));

  async function init() {
    if (initialized.value) return;
    initialized.value = true;

    await fetchStatuses();
  }

  async function fetchStatuses() {
    if (!userId.value) return;

    loading.value = true;

    try {
      const { data } = await getStatuses({
        query: { userId: userId.value }
      });

      statuses.value = data ?? [];
    } finally {
      loading.value = false;
    }
  }

  async function createStatus(name: string, color: StatusColor) {
    if (!userId.value) return;

    const tempId = -Date.now();

    const temp: StatusWithMeta = {
      id: tempId,
      userId: userId.value,
      name,
      color,
      pending: true
    };

    await optimistic({
      scope: 'statuses',
      key: String(tempId),

      apply() {
        statuses.value.push(temp);
      },

      rollback() {
        statuses.value = statuses.value.filter((s) => s.id !== tempId);
      },

      async run() {
        const { data } = await postStatuses({
          body: {
            userId: userId.value!,
            name,
            color
          }
        });

        const status = statuses.value.find((s) => s.id === tempId);

        if (!status) return;

        status.id = data.id;
        status.pending = false;
      }
    });
  }

  async function updateStatus(id: number, payload: { name?: string; color?: StatusColor }) {
    const status = statuses.value.find((s) => s.id === id);
    if (!status) return;
    console.log(payload.name);
    console.log(status.name);
    console.log(payload.color === status.color);

    if (payload.name === status.name && payload.color === status.color) return;

    const prev = { ...status };

    await optimistic({
      scope: 'statuses',
      key: String(id),

      apply() {
        Object.assign(status, payload);
      },

      rollback() {
        Object.assign(status, prev);
      },

      run() {
        return patchStatuseById({
          path: { id },
          body: payload
        });
      }
    });
  }

  async function deleteStatus(id: number) {
    const prev = statuses.value;

    await optimistic({
      scope: 'statuses',
      key: String(id),

      apply() {
        statuses.value = statuses.value.filter((s) => s.id !== id);
      },

      rollback() {
        statuses.value = [...prev];
      },

      run() {
        return deleteStatuseById({
          path: { id }
        });
      }
    });
  }

  watch(
    userId,
    (id) => {
      if (!id) return;
      fetchStatuses();
    },
    { immediate: true }
  );

  return {
    statuses,
    byId,
    loading,

    init,
    fetchStatuses,
    createStatus,
    updateStatus,
    deleteStatus
  };
});
