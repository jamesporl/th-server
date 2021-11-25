import { ForbiddenError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { addDays, format } from 'date-fns';
import jwt from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';
import config from 'core/config';
import { MUser, MAccount } from '../../../db';
import validateEmailByRegex from '../../../utils/validateEmailByRegex';
import LoginInput from '../../entities/LoginInput';
import generateAuthToken from 'mods/base/utils/generateAuthToken';

@Resolver()
export default class {
  @Mutation(() => String, { description: 'Authenticates a user with email and password' })
  async login(
    @Arg('input', () => LoginInput) input: LoginInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { email, password } = input;
    const isEmailValid = validateEmailByRegex(email);
    if (!isEmailValid) {
      throw new UserInputError('Invalid e-mail format.');
    }
    const user = await MUser.findOne(
      { email, isActive: true },
      { _id: 1, roles: 1, password: 1 },
    ).lean();

    const account = await MAccount.findOne({ userId: user._id }, { _id: 1 }).lean();

    if (!user) {
      throw new ForbiddenError('Invalid credentials.');
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new ForbiddenError('Invalid credentials.');
    }

    const authToken = generateAuthToken(user, account._id.toHexString());

    return authToken;
  }
}
