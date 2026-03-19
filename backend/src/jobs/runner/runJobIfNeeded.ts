import { prisma } from '@/db';

interface JobOptions {
  intervalMs: number;
  key: string;
  handler: () => Promise<void>;
}

export async function runJobIfNeeded({ key, intervalMs, handler }: JobOptions) {
  const now = new Date();

  const job = await prisma.systemJob.findUnique({
    where: { key }
  });

  const shouldRun = !job?.lastRunAt || now.getTime() - job.lastRunAt.getTime() >= intervalMs;

  if (!shouldRun) return;

  await prisma.systemJob.upsert({
    where: { key },
    update: { lastRunAt: now },
    create: { key, lastRunAt: now }
  });

  try {
    await handler();
  } catch (err) {
    console.error(`Job ${key} failed`, err);
  }
}
