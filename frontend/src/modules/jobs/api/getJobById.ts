import { getJobById } from '@/common/api/generated';

export async function getJob(id: string) {
  return getJobById({
    path: {
      id
    }
  });
}
