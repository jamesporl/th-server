import 'reflect-metadata';

export enum OAuthWebsiteKey {
  google = 'google',
}

export const OAUTH_WEBSITE_KEYS = Object.values(OAuthWebsiteKey);

export enum OAuthTokenType {
  access = 'access',
  refresh = 'refresh',
}

export const OAUTH_TOKEN_TYPES = Object.values(OAuthTokenType);
