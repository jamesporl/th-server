import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import hashPassword from '../../../utils/hashPassword';
import { MUser } from '../../../db';
import { ResetPasswordWithAuthInput } from '../../entities/Auth';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload, { description: 'Reset password as an authenticated user' })
  async resetPasswordWithAuth(
    @Ctx() { userId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => ResetPasswordWithAuthInput) input: ResetPasswordWithAuthInput,
  ) {
    const { newPassword } = input;

    await MUser.updateOne({ _id: userId }, { $set: { password: await hashPassword(newPassword) } });

    return { isCompleted: true };
  }
}
