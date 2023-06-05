import { Worker, Queue, Job } from 'bullmq';
import Redis from 'ioredis';
import config from 'core/config';
import jobsRegistry from './jobsRegistry';

const { REDIS_HOST, REDIS_PORT } = config;

export const QUEUE_NAME = 'thQueue';

export const jobQueue = new Queue(QUEUE_NAME, {
  connection: new Redis({ host:REDIS_HOST, port: REDIS_PORT }),
  defaultJobOptions: { removeOnComplete: true },
});

async function processJob(job: Job) {
  const { data } = job;
  const { jobType, params } = data as { jobType?: string; params: unknown };
  if (jobType) {
    const job = jobsRegistry.find((j) => j.key === jobType);
    if (job?.processJob) {
      await job.processJob(params);
    }
  }
}

export default function createJobWorker() {
  new Worker(QUEUE_NAME, processJob, {
    connection: new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      maxRetriesPerRequest: null,
    }),
  });
}
