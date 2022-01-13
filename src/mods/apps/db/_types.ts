import {
  Image, TimeStamps, AccountStamps, SocialUrls,
} from 'mods/base/db/_types';
import { Types, Document } from 'mongoose';
import { AppStatus } from '../api/entities/_enums';

export interface BannerImg {
  order: number;
  image: Image;
}

export interface App extends TimeStamps, AccountStamps {
  name: string;
  desc?: string;
  shortDesc?: string;
  logoImg?: Image;
  videoUrl?: string;
  bannerImgs?: BannerImg[];
  ownedBy: Types.ObjectId;
  publishedAt?: Date;
  playStoreUrl?: string;
  appStoreUrl?: string;
  websiteUrl?: string;
  status: AppStatus;
  tagIds?: Types.ObjectId[];
  supportsCount: number;
  commentsCount: number;
  isSponsored?: boolean;
  slug?: string;
  socialUrls?: SocialUrls;
}

export type DbApp = App & Document;

export interface AppDraft extends TimeStamps {
  appId: Types.ObjectId;
  name: string;
  desc?: string;
  shortDesc?: string;
  logoImg?: Image;
  videoUrl?: string;
  bannerImgs?: BannerImg[];
  ownedBy: Types.ObjectId;
  playStoreUrl?: string;
  appStoreUrl?: string;
  websiteUrl?: string;
  tagIds?: Types.ObjectId[];
  socialUrls?: SocialUrls;
  submittedAt?: Date;
}

export type DbAppDraft = AppDraft & Document;

export interface AppTag {
  name: string;
}

export type DbAppTag = AppTag & Document;

export interface AppSupport extends TimeStamps {
  accountId: Types.ObjectId;
  appId: Types.ObjectId;
}

export type DbAppSupport = AppSupport & Document;

export interface AppComment extends TimeStamps {
  appId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  content?: string;
  isPinned?: boolean;
  createdBy: Types.ObjectId,
}

export type DbAppComment = AppComment & Document;
