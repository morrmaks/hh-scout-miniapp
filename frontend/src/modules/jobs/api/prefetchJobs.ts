import { getJobsPrefetch } from '@/common/api/generated';

export async function prefetchJobs(q: string, page: number, index: number) {
  return getJobsPrefetch({
    query: {
      q,
      page,
      index
    }
  });
}
