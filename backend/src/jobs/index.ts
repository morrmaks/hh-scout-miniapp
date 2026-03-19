import { salaryRecalcJob } from './definitions/salaryRecalc.job';
import { runJobIfNeeded } from './runner/runJobIfNeeded';

const jobs = [salaryRecalcJob];

export async function runJobs() {
  await Promise.all(jobs.map((job) => runJobIfNeeded(job)));
}
