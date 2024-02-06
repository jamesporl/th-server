import { Ctx, Mutation, Resolver } from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import { MAccount } from '../../../db/index.js';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload.js';
import redisConnection from '../../../../../core/redisConnection.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async updateAccountLastSeenAt(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
  ) {
    const lastSeenAtKey = `lastSeenAt_${accountId}`;
    const keyExists = await redisConnection.get(lastSeenAtKey);
    if (!keyExists) {
      await MAccount.updateOne({ _id: accountId }, { $set: { lastSeenAt: new Date() } });
      redisConnection.setex(lastSeenAtKey, 60, 1);
    }
    return { isCompleted: true };
  }
}
