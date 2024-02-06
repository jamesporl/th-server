import { randomBytes } from 'crypto';
import { Arg, Mutation } from 'type-graphql';
import { OAuth2Client } from 'google-auth-library';
import config from '../../../../../core/config.js';
import { MAccount } from '../../../db/index.js';
import hashPassword from '../../../utils/hashPassword.js';
import generateAuthToken from '../../../utils/generateAuthToken.js';
import sendWelcomeForGoogleSignupEmail from '../../../utils/sendWelcomeForGoogleSignupEmail.js';
import sendMail from '../../../../external/sendGrid/utils/sendMail.js';
import { SendGridTemplateKey } from '../../../../external/sendGrid/utils/sendGridTemplates.js';
import { LoginWithGoogleInput } from '../../entities/Auth.js';

const client = new OAuth2Client();

export interface GoogleAccessTokenResponseData {
  refresh_token: string;
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
}

export interface GoogleProfileResponseData {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export default class {
  @Mutation(() => String)
  async loginWithGoogle(
    @Arg('input', () => LoginWithGoogleInput) input: LoginWithGoogleInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { credential } = input;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let account = await MAccount.findOne({ email: payload.email });

    if (!account) {
      const randomPw = randomBytes(8).toString('hex');

      account = await new MAccount({
        firstName: payload.given_name,
        lastName: payload.family_name,
        name: payload.name,
        email: payload.email,
        password: await hashPassword(randomPw),
        isVerified: true,
        isAdmin: false,
        lastSeenAt: new Date(),
      }).save();

      await sendWelcomeForGoogleSignupEmail(account);

      await sendMail({
        to: config.ADMIN_EMAIL,
        templateKey: SendGridTemplateKey.adminNewUser,
        dynamicTemplateData: {
          name: account.name,
          email: account.email,
        },
      });
    }

    const authToken = generateAuthToken(account);

    return authToken;
  }
}
