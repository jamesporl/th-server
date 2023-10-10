import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import { MAccount } from '../../../db/index.js';
import { UpdateEmailInput } from '../../entities/Auth.js';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async updateEmail(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateEmailInput) input: UpdateEmailInput,
  ) {
    const { newEmail } = input;

    const existingUser = await MAccount.findOne({ email: newEmail, _id: { $ne: accountId } });
    if (existingUser) {
      throw new UserInputError('Email is already taken');
    }

    await MAccount.updateOne({ _id: accountId }, { $set: { email: newEmail } });

    return { isCompleted: true };
  }
}
