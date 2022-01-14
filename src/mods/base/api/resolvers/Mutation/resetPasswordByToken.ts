import { UserInputError } from 'apollo-server-express';
import { isBefore } from 'date-fns';
import { Arg, Mutation, Resolver } from 'type-graphql';
import hashPassword from '../../../utils/hashPassword';
import { MUser } from '../../../db';
import { ResetPasswordByTokenInput } from '../../entities/Auth';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload, { description: 'Reset password as an authenticated user' })
  async resetPasswordByToken(
  @Arg('input', () => ResetPasswordByTokenInput) input: ResetPasswordByTokenInput,
  ) {
    const { newPassword, email, token } = input;
    const user = await MUser.findOne({ email: email.toLowerCase(), isActive: true }).lean();
    if (!user) {
      throw new UserInputError('E-mail not found.');
    }
    if (user.pwResetToken === token && isBefore(new Date(), user.pwResetTokenExpiresAt)) {
      await MUser.updateOne(
        { _id: user._id },
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
