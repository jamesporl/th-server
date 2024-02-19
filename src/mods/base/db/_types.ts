import { Types, Document } from 'mongoose';

export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountStamps {
  createdBy?: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface SocialUrls {
  x?: string;
  facebook?: string;
  linkedIn?: string;
  github?: string;
  instagram?: string;
  threads?: string;
  tiktok?: string;
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
  bio?: string;
  location: string;
  websiteUrl: string;
  socialUrls: SocialUrls;
  lastSeenAt: Date;
}

export type DbAccount = Account & Document;
