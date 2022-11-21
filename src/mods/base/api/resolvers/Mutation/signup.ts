import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import sendWelcomeWithVerificationCodeEmail from '../../../utils/sendWelcomeWithVerificationCodeEmail';
import { MUser, MAccount } from '../../../db';
import validateEmailByRegex from '../../../utils/validateEmailByRegex';
import hashPassword from '../../../utils/hashPassword';
import { SignupInput } from '../../entities/Auth';
import { RoleKey } from '../../entities/_enums';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload)
  async signup(
    @Arg('input', () => SignupInput) input: SignupInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const {
      firstName: iFirstName, lastName: iLastName, email: iEmail, password,
    } = input;

    const email = iEmail.toLowerCase().trim();
    const firstName = iFirstName.trim();
    const lastName = iLastName.trim();

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
      isVerified: false,
    }).save();

    await new MAccount({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      userId: newUser._id,
    }).save();

    await sendWelcomeWithVerificationCodeEmail(newUser._id);

    return { isCompleted: true };
  }
}
