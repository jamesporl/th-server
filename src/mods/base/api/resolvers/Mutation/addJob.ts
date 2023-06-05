import { UserInputError } from 'apollo-server-express';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { Types } from 'mongoose';
import { isValidCron } from 'cron-validator';
import { jobQueue } from 'core/jobs/createJobWorker';
import IsAdmin from 'core/graphql/IsAdmin';
import jobsRegistry from 'core/jobs/jobsRegistry';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';
import { AddJobInput } from '../../entities/Job';

@Resolver()
export default class {
  @IsAdmin()
  @Mutation(() => DefaultMutationPayload)
  async addJob(@Arg('input', () => AddJobInput) input: AddJobInput) {
    const { jobType, schedule } = input;

    if (schedule && !isValidCron(schedule)) {
      throw new UserInputError('Schedule should be a valid cron expression.');
    }

    const job = jobsRegistry.find((j) => j.key === jobType);
    if (!job) {
      throw new UserInputError('Invalid job type');
    }

    let jobOptions = {};
    if (schedule) {
      jobOptions = { repeat: { cron: schedule } };
    }

    await jobQueue.add(
      new Types.ObjectId().toHexString(),
      { jobType },
      jobOptions,
    );

    return { isCompleted: true };
  }
}
