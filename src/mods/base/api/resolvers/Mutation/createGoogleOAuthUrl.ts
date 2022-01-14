import { randomBytes } from 'crypto';
import config from 'core/config';
import { Mutation } from 'type-graphql';
import { MOAuthState } from 'mods/base/db';
import { OAuthWebsiteKey } from '../../entities/_enums';

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

export default class {
  @Mutation(() => String)
  async createGoogleOAuthUrl() {
    const stateKey = randomBytes(8).toString('hex');

    await new MOAuthState({
      value: stateKey,
      websiteKey: OAuthWebsiteKey.google,
    }).save();

    const params = {
      scope: GMAIL_SCOPES.join(' '),
      client_id: config.GOOGLE_OAUTH_CLIENT_ID,
      access_type: 'offline',
      redirect_uri: config.GOOGLE_OAUTH_REDIRECT_URL,
      response_type: 'code',
      state: stateKey,
      prompt: 'consent',
    };

    const urlString = 'https://accounts.google.com/o/oauth2/v2/auth';

    const url = new URL(urlString);
    url.search = `${new URLSearchParams(params)}`;

    return url;
  }
}
