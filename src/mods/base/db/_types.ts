import { Types, Document } from 'mongoose';
import { OAuthTokenType, OAuthWebsiteKey, RoleKey } from '../api/entities/_enums';

export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountStamps {
  createdBy?: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface Image extends Document {
  _id: Types.ObjectId;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
}

export interface Account {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  image?: Image;
  phone?: string;
  shortDesc?: string;
  userId: Types.ObjectId;
}

export type DbAccount = Account & Document;

export interface Role {
  _id: Types.ObjectId;
  role: RoleKey;
}

export interface User {
  _id: Types.ObjectId;
  email: string;
  isActive: boolean;
  name: string;
  password?: string;
  pwResetToken?: string;
  pwResetTokenExpiresAt?: Date;
  roles: Role[];
}

export type DbUser = User & Document;

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
