import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import sendMail from '../../../../external/sendGrid/utils/sendMail.js';
import config from '../../../../../core/config.js';
import { SendGridTemplateKey } from '../../../../external/sendGrid/utils/sendGridTemplates.js';
import sendWelcomeWithVerificationCodeEmail from '../../../utils/sendWelcomeWithVerificationCodeEmail.js';
import { MAccount } from '../../../db/index.js';
import validateEmailByRegex from '../../../utils/validateEmailByRegex.js';
import hashPassword from '../../../utils/hashPassword.js';
import { SignupInput } from '../../entities/Auth.js';
import DefaultMutationPayload from '../../entities/DefaultMutationPayload.js';

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
      lastSeenAt: new Date(),
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
