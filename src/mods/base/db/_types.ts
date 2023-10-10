import { Types, Document } from 'mongoose';
import { OAuthTokenType, OAuthWebsiteKey } from '../api/entities/_enums.js';

export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountStamps {
  createdBy?: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface Account {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  image?: string;
  phone?: string;
  shortDesc?: string;
  isActive: boolean;
  isAdmin: boolean;
  password?: string;
  pwResetLinkSentAt?: Date;
  pwResetToken?: string;
  pwResetTokenExpiresAt?: Date;
  isVerified?: boolean;
  verificationCodeSentAt?: Date;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  verificationAttempts?: number;
}

export type DbAccount = Account & Document;

export interface SocialUrls {
  twitter?: string;
  facebook?: string;
  linkedIn?: string;
  github?: string;
  instagram?: string;
}

export interface OAuthToken {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  token: string;
  tokenType: OAuthTokenType;
  websiteKey: OAuthWebsiteKey;
}

export type DbOAuthToken = OAuthToken & Document;

export interface OAuthState {
  _id: Types.ObjectId;
  value: string;
  websiteKey: OAuthWebsiteKey;
}

export type DbOAuthState = OAuthState & Document;
