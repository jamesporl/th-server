import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { SendGridTemplateKey } from 'mods/external/sendGrid/utils/sendGridTemplates';
import { Account } from '../db/_types';

export default async function sendWelcomeForGoogleSignupEmail(account: Account) {
  await sendMail({
    to: account.email,
    templateKey: SendGridTemplateKey.welcomeForGoogleSignup,
    dynamicTemplateData: { firstName: account.firstName },
  });
}
