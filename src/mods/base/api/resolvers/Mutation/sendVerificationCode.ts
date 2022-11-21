import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { differenceInSeconds } from 'date-fns';
import sendVerificationCodeEmail from 'mods/base/utils/sendVerificationCodeEmail';
import { MUser } from '../../../db';
import { SendVerificationCodeInput } from '../../entities/Auth';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload)
  async sendVerificationCode(
    @Arg('input', () => SendVerificationCodeInput) input: SendVerificationCodeInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { email } = input;

    const user = await MUser.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        let moreSeconds = 0;
        if (user.verificationCodeSentAt) {
          moreSeconds = 60 - differenceInSeconds(new Date(), user.verificationCodeSentAt);
        }
        if (moreSeconds > 0) {
          throw new UserInputError(`Try again in ${moreSeconds} seconds`);
        } else {
          await sendVerificationCodeEmail(user._id);
        }
      }
    }

    return { isCompleted: true };
  }
}
