import { randomBytes } from 'crypto';
import { UserInputError } from 'apollo-server-express';
import { addDays } from 'date-fns';
import { Arg, Mutation, Resolver } from 'type-graphql';
import config from 'core/config';
import { MUser } from '../../../db';
import validateEmailByRegex from '../../../utils/validateEmailByRegex';
import { SendPasswordResetLinkInput } from '../../entities/Auth';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload)
  async sendPasswordResetLink(
    @Arg('input', () => SendPasswordResetLinkInput) input: SendPasswordResetLinkInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { email } = input;
    const isEmailValid = validateEmailByRegex(email);
    if (!isEmailValid) {
      throw new UserInputError('Invalid e-mail format.');
    }
    const user = await MUser.findOne({ email: email.toLowerCase(), isActive: true }).lean();

    if (user) {
      const pwResetToken = randomBytes(32).toString('hex');
      const pwResetTokenExpiresAt = addDays(new Date(), 1);
      await MUser.updateOne({ _id: user._id }, { $set: { pwResetToken, pwResetTokenExpiresAt } });
      const url = new URL(`${config.TH_CLIENT_BASE_URL}/account/reset-password`);
      url.searchParams.append('token', pwResetToken);
      url.searchParams.append('email', email);
      console.log(url.href);
    }

    return { isCompleted: true };
  }
}
