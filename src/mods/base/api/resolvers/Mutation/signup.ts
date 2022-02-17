import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import generateAuthToken from 'mods/base/utils/generateAuthToken';
import { MUser, MAccount } from '../../../db';
import validateEmailByRegex from '../../../utils/validateEmailByRegex';
import hashPassword from '../../../utils/hashPassword';
import { SignupInput } from '../../entities/Auth';
import { RoleKey } from '../../entities/_enums';

@Resolver()
export default class {
  @Mutation(() => String)
  async signup(
    @Arg('input', () => SignupInput) input: SignupInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const {
      firstName, lastName, email: iEmail, password,
    } = input;

    const email = iEmail.toLowerCase().trim();

    const isEmailValid = validateEmailByRegex(email);
    if (!isEmailValid) {
      throw new UserInputError('Invalid e-mail format.');
    }

    const emailExists = await MUser.findOne({ email }, { _id: 1 }).lean();
    if (emailExists) {
      throw new UserInputError('E-mail already exists.');
    }

    const newUser = await new MUser({
      email,
      password: await hashPassword(password),
      roles: [{ role: RoleKey.user }],
    }).save();

    const newAccount = await new MAccount({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      userId: newUser._id,
    }).save();

    const authToken = generateAuthToken(newUser, newAccount._id.toHexString());

    return authToken;
  }
}
