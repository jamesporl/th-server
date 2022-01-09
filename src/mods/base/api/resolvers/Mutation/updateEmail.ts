import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import { MAccount, MUser } from '../../../db';
import { UpdateEmailInput } from '../../entities/Auth';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async updateEmail(
    @Ctx() { userId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateEmailInput) input: UpdateEmailInput,
  ) {
    const { newEmail } = input;

    const existingUser = await MUser.findOne({ email: newEmail, _id: { $ne: userId } });
    if (existingUser) {
      throw new UserInputError('Email is already taken');
    }

    await MUser.updateOne({ _id: userId }, { $set: { email: newEmail } });
    await MAccount.updateOne({ userId }, { $set: { email: newEmail } });

    return { isCompleted: true };
  }
}
