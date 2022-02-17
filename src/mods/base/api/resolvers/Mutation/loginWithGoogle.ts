import { randomBytes } from 'crypto';
import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation } from 'type-graphql';
import fetch from 'node-fetch';
import config from 'core/config';
import { MAccount, MOAuthState, MUser } from 'mods/base/db';
import hashPassword from 'mods/base/utils/hashPassword';
import generateAuthToken from 'mods/base/utils/generateAuthToken';
import { OAuthWebsiteKey, RoleKey } from '../../entities/_enums';
import { LoginWithGoogleInput } from '../../entities/Auth';

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
    );

    const profileBody = await profileResp.json() as GoogleProfileResponseData;

    let accountId: string;
    let user = await MUser.findOne({ email: profileBody.email });

    if (!user) {
      const randomPw = randomBytes(8).toString('hex');
      user = await new MUser({
        email: profileBody.email,
        password: await hashPassword(randomPw),
        roles: [{ role: RoleKey.user }],
      }).save();

      const newAccount = await new MAccount({
        firstName: profileBody.given_name,
        lastName: profileBody.family_name,
        name: `${profileBody.given_name} ${profileBody.family_name}`,
        email: profileBody.email,
        userId: user._id,
      }).save();

      accountId = newAccount._id.toHexString();
    } else {
      const account = await MAccount.findOne({ userId: user._id });
      accountId = account._id.toHexString();
    }

    const authToken = generateAuthToken(user, accountId);

    return authToken;
  }
}
