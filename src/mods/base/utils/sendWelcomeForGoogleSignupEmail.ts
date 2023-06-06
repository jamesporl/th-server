import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { Account } from '../db/_types';

export default async function sendWelcomeForGoogleSignupEmail(account: Account) {
  await sendMail({
    to: account.email,
    templateKey: 'welcomeForGoogleSignup',
    dynamicTemplateData: { firstName: account.firstName },
  });
}
