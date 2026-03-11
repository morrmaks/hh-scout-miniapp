// import { defineStore } from 'pinia';
// import { ref } from 'vue';

// import type { Job } from '@/common/api/generated';

// import { deleteFavoriteByUserIdByJobId, getFavoriteByUserId } from '@/common/api/generated';

// const PAGE_SIZE = 20;

// export const useFavoritesStore = defineStore('favorites', () => {
//   const items = ref<Job[]>([]);

//   const loading = ref(false);
//   const loadingMore = ref(false);

//   const page = ref(1);
//   const hasMore = ref(true);

//   const userId = ref<number | null>(null);

//   async function fetchFavorites(id: number) {
//     userId.value = id;

//     loading.value = true;
//     page.value = 1;

//     const { data } = await getFavoriteByUserId({
//       path: { userId: id },
//       query: {
//         page: 1,
//         per_page: PAGE_SIZE
//       }
//     });

//     items.value = data.items ?? [];
//     hasMore.value = items.value.length === PAGE_SIZE;

//     loading.value = false;
//   }

//   async function loadMore() {
//     if (!userId.value) return;
//     if (!hasMore.value) return;
//     if (loadingMore.value) return;

//     loadingMore.value = true;

//     const nextPage = page.value + 1;

//     const { data } = await getFavoriteByUserId({
//       path: { userId: userId.value },
//       query: {
//         page: nextPage,
//         per_page: PAGE_SIZE
//       }
//     });

//     const nextItems = data.items ?? [];

//     items.value = [...items.value, ...nextItems];

//     page.value = nextPage;
//     hasMore.value = nextItems.length === PAGE_SIZE;

//     loadingMore.value = false;
//   }

//   async function removeFavorite(jobId: string) {
//     if (!userId.value) return;

//     await deleteFavoriteByUserIdByJobId({
//       path: {
//         userId: userId.value,
//         jobId
//       }
//     });

//     items.value = items.value.filter((j) => j.id !== jobId);
//   }

//   return {
//     items,
//     loading,
//     loadingMore,
//     hasMore,

//     fetchFavorites,
//     loadMore,
//     removeFavorite
//   };
// });
