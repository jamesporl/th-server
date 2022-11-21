import { addMinutes } from 'date-fns';
import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { Types } from 'mongoose';
import { MAccount, MUser } from '../db';
import generateSixDigitCode from './generateSixDigitCode';

export default async function sendWelcomeWithVerificationCodeEmail(userId: Types.ObjectId) {
  const verificationCode = generateSixDigitCode();
  const user = await MUser.findOne({ _id: userId });
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
    templateKey: 'welcomeWithVerificationCode',
    dynamicTemplateData: { firstName: account.firstName, verificationCode },
  });
}
