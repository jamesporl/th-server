import { randomBytes } from 'crypto';
import { URL } from 'node:url';
import { UserInputError } from 'apollo-server-express';
import { addDays, differenceInSeconds } from 'date-fns';
import { Arg, Mutation, Resolver } from 'type-graphql';
import config from '../../../../../core/config.js';
import sendMail from '../../../../external/sendGrid/utils/sendMail.js';
import { SendGridTemplateKey } from '../../../../external/sendGrid/utils/sendGridTemplates.js';
import { MAccount } from '../../../db/index.js';
import validateEmailByRegex from '../../../utils/validateEmailByRegex.js';
import { SendPasswordResetLinkInput } from '../../entities/Auth.js';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload.js';

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
    const account = await MAccount.findOne(
      { email: email.toLowerCase().trim(), isActive: true },
    ).lean();

    if (account) {
      let moreSeconds = 0;
      if (account.pwResetLinkSentAt) {
        moreSeconds = 60 - differenceInSeconds(new Date(), account.pwResetLinkSentAt);
      }
      if (moreSeconds > 0) {
        throw new UserInputError(`Try again in ${moreSeconds} seconds`);
      }
      const pwResetToken = randomBytes(32).toString('hex');
      const pwResetTokenExpiresAt = addDays(new Date(), 1);
      await MAccount.updateOne(
        { _id: account._id },
        { $set: { pwResetToken, pwResetTokenExpiresAt, pwResetLinkSentAt: new Date() } },
      );
      const url = new URL(`${config.TH_CLIENT_BASE_URL}/account/reset-password`);
      url.searchParams.append('token', pwResetToken);
      url.searchParams.append('email', email);
      await sendMail({
        to: account.email,
        templateKey: SendGridTemplateKey.pwResetLink,
        dynamicTemplateData: { firstName: account.firstName, pwResetLink: url },
      });
    }

    return { isCompleted: true };
  }
}
