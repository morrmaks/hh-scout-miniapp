import { runJobs } from '@/jobs';
import { startScheduler } from '@/jobs/scheduler/scheduler';

export async function startJobs() {
  await runJobs();
  startScheduler();
}
