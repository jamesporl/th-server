import { addMinutes, differenceInSeconds } from 'date-fns';
import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { SendGridTemplateKey } from 'mods/external/sendGrid/utils/sendGridTemplates';
import generateSixDigitCode from './generateSixDigitCode';
import { Account } from '../db/_types';
import { MAccount } from '../db';

export default async function sendVerificationCodeEmail(account: Account) {
  const verificationCode = generateSixDigitCode();
  if (account.verificationCodeSentAt
    && differenceInSeconds(new Date(), account.verificationCodeSentAt) < 60) {
    return;
  }
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
    templateKey: SendGridTemplateKey.verificationCode,
    dynamicTemplateData: { firstName: account.firstName, verificationCode },
  });
}
