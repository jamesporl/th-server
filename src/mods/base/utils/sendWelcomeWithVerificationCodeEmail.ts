import { addMinutes } from 'date-fns';
import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { SendGridTemplateKey } from 'mods/external/sendGrid/utils/sendGridTemplates';
import { MAccount } from '../db';
import generateSixDigitCode from './generateSixDigitCode';
import { Account } from '../db/_types';

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
