import { postJobsPrefetch } from '@/common/api/generated';

export async function prefetchJobs(ids: string[]) {
  return postJobsPrefetch({
    body: {
      ids
    }
  });
}
