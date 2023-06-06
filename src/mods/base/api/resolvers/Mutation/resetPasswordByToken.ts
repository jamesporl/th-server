import { UserInputError } from 'apollo-server-express';
import { isBefore } from 'date-fns';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { MAccount } from 'mods/base/db';
import hashPassword from '../../../utils/hashPassword';
import { ResetPasswordByTokenInput } from '../../entities/Auth';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload, { description: 'Reset password as an authenticated user' })
  async resetPasswordByToken(
  @Arg('input', () => ResetPasswordByTokenInput) input: ResetPasswordByTokenInput,
  ) {
    const { newPassword, email, token } = input;
    const account = await MAccount.findOne(
      { email: email.toLowerCase().trim(), isActive: true },
    ).lean();
    if (!account) {
      throw new UserInputError('E-mail not found.');
    }
    if (account.pwResetToken === token && isBefore(new Date(), account.pwResetTokenExpiresAt)) {
      await MAccount.updateOne(
        { _id: account._id },
        {
          $set: { password: await hashPassword(newPassword) },
          $unset: { pwResetToken: 1, pwResetTokenExpiresAt: 1 },
        },
      );
    } else {
      throw new UserInputError('Invalid password reset token.');
    }

    return { isCompleted: true };
  }
}
