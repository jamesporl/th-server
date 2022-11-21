import { addMinutes, differenceInSeconds } from 'date-fns';
import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { Types } from 'mongoose';
import { MAccount, MUser } from '../db';
import generateSixDigitCode from './generateSixDigitCode';

export default async function sendVerificationCodeEmail(userId: Types.ObjectId) {
  const verificationCode = generateSixDigitCode();
  const user = await MUser.findOne({ _id: userId });
  if (user.verificationCodeSentAt
    && differenceInSeconds(new Date(), user.verificationCodeSentAt) < 60) {
    return;
  }
  const account = await MAccount.findOne({ userId });
  await MUser.updateOne(
    { _id: userId },
    {
      verificationCodeSentAt: new Date(),
      verificationCode,
      verificationAttempts: 0,
      verificationCodeExpiry: addMinutes(new Date(), 30),
    },
  );
  await sendMail({
    to: user.email,
    templateKey: 'verificationCode',
    dynamicTemplateData: { firstName: account.firstName, verificationCode },
  });
}
