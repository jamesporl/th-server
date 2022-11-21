import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { isAfter } from 'date-fns';
import generateAuthToken from '../../../utils/generateAuthToken';
import { MUser, MAccount } from '../../../db';
import { VerifyAccountByCodeInput } from '../../entities/Auth';

@Resolver()
export default class {
  @Mutation(() => String)
  async verifyAccountByCode(
    @Arg('input', () => VerifyAccountByCodeInput) input: VerifyAccountByCodeInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { email, code } = input;

    const errorMessage = 'Invalid code';
    const user = await MUser.findOne({ email });
    if (!user) {
      throw new UserInputError(errorMessage);
    }

    if (!user.isVerified) {
      if (isAfter(new Date(), user.verificationCodeExpiry)) {
        throw new UserInputError(errorMessage);
      }
      if ((user.verificationAttempts || 0) > 5) {
        throw new UserInputError(errorMessage);
      }
      if (user.verificationCode === code) {
        await MUser.updateOne(
          { email },
          {
            $set: { isVerified: true, verificationAttempts: 0 },
            $unset: {
              verificationCode: 1,
              verificationCodeExpiry: 1,
            },
          },
        );
      } else {
        const verificationAttempts = user.verificationAttempts ? 1 : user.verificationAttempts + 1;
        await MUser.updateOne({ email }, { $set: { verificationAttempts } });
        throw new UserInputError(errorMessage);
      }
    } else {
      throw new UserInputError(errorMessage);
    }

    const account = await MAccount.findOne({ userId: user._id });
    const authToken = generateAuthToken(user, account._id.toHexString());

    return authToken;
  }
}
