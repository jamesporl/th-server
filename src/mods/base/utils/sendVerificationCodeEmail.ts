import { addMinutes, differenceInSeconds } from 'date-fns';
import sendMail from '../../external/sendGrid/utils/sendMail.js';
import { SendGridTemplateKey } from '../../external/sendGrid/utils/sendGridTemplates.js';
import generateSixDigitCode from './generateSixDigitCode.js';
import { Account } from '../db/_types.js';
import { MAccount } from '../db/index.js';

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
