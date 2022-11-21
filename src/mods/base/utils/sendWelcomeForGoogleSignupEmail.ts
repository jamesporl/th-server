import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { Types } from 'mongoose';
import { MAccount } from '../db';

export default async function sendWelcomeForGoogleSignupEmail(userId: Types.ObjectId) {
  const account = await MAccount.findOne({ userId });
  await sendMail({
    to: account.email,
    templateKey: 'welcomeForGoogleSignup',
    dynamicTemplateData: { firstName: account.firstName },
  });
}
