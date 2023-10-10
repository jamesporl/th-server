import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { differenceInSeconds } from 'date-fns';
import sendVerificationCodeEmail from '../../../utils/sendVerificationCodeEmail.js';
import { MAccount } from '../../../db/index.js';
import { SendVerificationCodeInput } from '../../entities/Auth.js';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload.js';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload)
  async sendVerificationCode(
    @Arg('input', () => SendVerificationCodeInput) input: SendVerificationCodeInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { email } = input;

    const account = await MAccount.findOne({ email });
    if (account) {
      if (!account.isVerified) {
        let moreSeconds = 0;
        if (account.verificationCodeSentAt) {
          moreSeconds = 60 - differenceInSeconds(new Date(), account.verificationCodeSentAt);
        }
        if (moreSeconds > 0) {
          throw new UserInputError(`Try again in ${moreSeconds} seconds`);
        } else {
          await sendVerificationCodeEmail(account);
        }
      }
    }

    return { isCompleted: true };
  }
}
