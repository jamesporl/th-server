import { ForbiddenError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { Arg, Mutation, Resolver } from 'type-graphql';
import sendVerificationCodeEmail from '../../../utils/sendVerificationCodeEmail.js';
import generateAuthToken from '../../../utils/generateAuthToken.js';
import { MAccount } from '../../../db/index.js';
import validateEmailByRegex from '../../../utils/validateEmailByRegex.js';
import { LoginInput } from '../../entities/Auth.js';

@Resolver()
export default class {
  @Mutation(() => String, { description: 'Authenticates a user with email and password' })
  async login(
    @Arg('input', () => LoginInput) input: LoginInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { email: iEmail, password } = input;

    const email = iEmail.toLowerCase().trim();

    const isEmailValid = validateEmailByRegex(email);
    if (!isEmailValid) {
      throw new UserInputError('Invalid e-mail format.');
    }
    const account = await MAccount.findOne({ email, isActive: true }).lean();

    if (!account) {
      throw new ForbiddenError('Invalid credentials.');
    }

    const isMatched = await bcrypt.compare(password, account.password);
    if (!isMatched) {
      throw new ForbiddenError('Invalid credentials.');
    }

    let authToken = '';
    if (account.isVerified) {
      authToken = generateAuthToken(account);
    } else {
      await sendVerificationCodeEmail(account);
    }

    return authToken;
  }
}
