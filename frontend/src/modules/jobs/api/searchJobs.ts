import { getJobs } from '@/common/api/generated';

export async function searchJobs(query: string, page = 1) {
  return getJobs({
    query: {
      q: query,
      page
    }
  });
}
