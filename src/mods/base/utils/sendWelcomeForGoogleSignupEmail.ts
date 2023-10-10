import sendMail from '../../external/sendGrid/utils/sendMail.js';
import { SendGridTemplateKey } from '../../external/sendGrid/utils/sendGridTemplates.js';
import { Account } from '../db/_types.js';

export default async function sendWelcomeForGoogleSignupEmail(account: Account) {
  await sendMail({
    to: account.email,
    templateKey: SendGridTemplateKey.welcomeForGoogleSignup,
    dynamicTemplateData: { firstName: account.firstName },
  });
}
