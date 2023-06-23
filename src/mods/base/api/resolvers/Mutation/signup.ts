import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import sendMail from 'mods/external/sendGrid/utils/sendMail';
import config from 'core/config';
import { SendGridTemplateKey } from 'mods/external/sendGrid/utils/sendGridTemplates';
import sendWelcomeWithVerificationCodeEmail from '../../../utils/sendWelcomeWithVerificationCodeEmail';
import { MAccount } from '../../../db';
import validateEmailByRegex from '../../../utils/validateEmailByRegex';
import hashPassword from '../../../utils/hashPassword';
import { SignupInput } from '../../entities/Auth';
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

    const emailExists = await MAccount.findOne({ email }, { _id: 1 }).lean();
    if (emailExists) {
      throw new UserInputError('E-mail already exists.');
    }

    const account = await new MAccount({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      password: await hashPassword(password),
      email,
      isVerified: false,
      isAdmin: false,
      isActive: true,
    }).save();

    await sendWelcomeWithVerificationCodeEmail(account);

    await sendMail({
      to: config.ADMIN_EMAIL,
      templateKey: SendGridTemplateKey.adminNewUser,
      dynamicTemplateData: {
        name: account.name,
        email: account.email,
      },
    });

    return { isCompleted: true };
  }
}
