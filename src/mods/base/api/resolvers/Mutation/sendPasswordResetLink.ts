import { randomBytes } from 'crypto';
import { UserInputError } from 'apollo-server-express';
import { addDays, differenceInSeconds } from 'date-fns';
import { Arg, Mutation, Resolver } from 'type-graphql';
import config from 'core/config';
import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { MAccount, MUser } from '../../../db';
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
    const account = await MAccount.findOne({ userId: user._id });

    if (user) {
      let moreSeconds = 0;
      if (user.pwResetLinkSentAt) {
        moreSeconds = 60 - differenceInSeconds(new Date(), user.pwResetLinkSentAt);
      }
      if (moreSeconds > 0) {
        throw new UserInputError(`Try again in ${moreSeconds} seconds`);
      }
      const pwResetToken = randomBytes(32).toString('hex');
      const pwResetTokenExpiresAt = addDays(new Date(), 1);
      await MUser.updateOne(
        { _id: user._id },
        { $set: { pwResetToken, pwResetTokenExpiresAt, pwResetLinkSentAt: new Date() } },
      );
      const url = new URL(`${config.TH_CLIENT_BASE_URL}/account/reset-password`);
      url.searchParams.append('token', pwResetToken);
      url.searchParams.append('email', email);
      await sendMail({
        to: user.email,
        templateKey: 'pwResetLink',
        dynamicTemplateData: { firstName: account.firstName, pwResetLink: url },
      });
    }

    return { isCompleted: true };
  }
}
