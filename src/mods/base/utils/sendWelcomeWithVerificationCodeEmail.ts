import { addMinutes } from 'date-fns';
import { SendGridTemplateKey } from '../../external/sendGrid/utils/sendGridTemplates.js';
import sendMail from '../../external/sendGrid/utils/sendMail.js';
import { MAccount } from '../db/index.js';
import generateSixDigitCode from './generateSixDigitCode.js';
import { Account } from '../db/_types.js';

export default async function sendWelcomeWithVerificationCodeEmail(account: Account) {
  const verificationCode = generateSixDigitCode();
  await MAccount.updateOne(
    { _id: account._id },
    {
      verificationCodeSentAt: new Date(),
      verificationCode,
      verificationAttempts: 0,
      verificationCodeExpiry: addMinutes(new Date(), 30),
    },
  );
  await sendMail({
    to: account.email,
    templateKey: SendGridTemplateKey.welcomeWithVerificationCode,
    dynamicTemplateData: { firstName: account.firstName, verificationCode },
  });
}
