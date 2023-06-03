import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { isAfter } from 'date-fns';
import generateAuthToken from '../../../utils/generateAuthToken';
import { MAccount } from '../../../db';
import { VerifyAccountByCodeInput } from '../../entities/Auth';

@Resolver()
export default class {
  @Mutation(() => String)
  async verifyAccountByCode(
    @Arg('input', () => VerifyAccountByCodeInput) input: VerifyAccountByCodeInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { email, code } = input;

    const errorMessage = 'Invalid code';
    const account = await MAccount.findOne({ email });
    if (!account) {
      throw new UserInputError(errorMessage);
    }

    if (!account.isVerified) {
      if (isAfter(new Date(), account.verificationCodeExpiry)) {
        throw new UserInputError(errorMessage);
      }
      if ((account.verificationAttempts || 0) > 5) {
        throw new UserInputError(errorMessage);
      }
      if (account.verificationCode === code) {
        await MAccount.updateOne(
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
        const verificationAttempts = account.verificationAttempts ? 1 : account.verificationAttempts + 1;
        await MAccount.updateOne({ email }, { $set: { verificationAttempts } });
        throw new UserInputError(errorMessage);
      }
    } else {
      throw new UserInputError(errorMessage);
    }

    const authToken = generateAuthToken(account);

    return authToken;
  }
}
