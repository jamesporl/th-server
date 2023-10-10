import { randomBytes } from 'crypto';
import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation } from 'type-graphql';
import { URLSearchParams } from 'node:url';
import fetch from 'node-fetch';
import config from '../../../../../core/config.js';
import { MAccount, MOAuthState } from '../../../db/index.js';
import hashPassword from '../../../utils/hashPassword.js';
import generateAuthToken from '../../../utils/generateAuthToken.js';
import sendWelcomeForGoogleSignupEmail from '../../../utils/sendWelcomeForGoogleSignupEmail.js';
import sendMail from '../../../../external/sendGrid/utils/sendMail.js';
import { SendGridTemplateKey } from '../../../../external/sendGrid/utils/sendGridTemplates.js';
import { OAuthWebsiteKey } from '../../entities/_enums.js';
import { LoginWithGoogleInput } from '../../entities/Auth.js';

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
    const { code, state } = input;
    const stateDoc = await MOAuthState.findOne(
      { value: state, websiteKey: OAuthWebsiteKey.google },
    );
    if (!stateDoc) {
      throw new UserInputError('Invalid state');
    }

    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: config.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: config.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: config.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type: 'authorization_code',
      }),
    });

    let tokenBody: GoogleAccessTokenResponseData;
    try {
      tokenBody = await tokenResp.json() as GoogleAccessTokenResponseData;
    } catch (error) {
      throw new UserInputError(error.message);
    }

    const profileResp = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenBody.access_token}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const profileBody = await profileResp.json() as GoogleProfileResponseData;

    let account = await MAccount.findOne({ email: profileBody.email });

    if (!account) {
      const randomPw = randomBytes(8).toString('hex');

      account = await new MAccount({
        firstName: profileBody.given_name,
        lastName: profileBody.family_name,
        name: `${profileBody.given_name} ${profileBody.family_name}`,
        email: profileBody.email,
        password: await hashPassword(randomPw),
        isVerified: true,
        isAdmin: false,
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
