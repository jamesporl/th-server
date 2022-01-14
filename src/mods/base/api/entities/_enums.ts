import 'reflect-metadata';
import { registerEnumType } from 'type-graphql';

export enum RoleKey {
  staff = 'staff',
  user = 'user',
}

registerEnumType(RoleKey, { name: 'RoleKey' });
export const ROLE_KEY_VALUES = Object.values(RoleKey);

export enum OAuthWebsiteKey {
  google = 'google',
}

export const OAUTH_WEBSITE_KEYS = Object.values(OAuthWebsiteKey);

export enum OAuthTokenType {
  access = 'access',
  refresh = 'refresh',
}

export const OAUTH_TOKEN_TYPES = Object.values(OAuthTokenType);
