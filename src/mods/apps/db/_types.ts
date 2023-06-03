import { TimeStamps, AccountStamps, SocialUrls } from 'mods/base/db/_types';
import { Types, Document } from 'mongoose';
import { AppStatus } from '../api/entities/_enums';

export interface BannerImg {
  order: number;
  image: {
    large: string;
    thumbnail: string;
  };
}

export interface App extends TimeStamps, AccountStamps {
  name: string;
  jsonDesc?: unknown;
  htmlDesc?: string;
  textDesc?: string;
  shortDesc?: string;
  logoImg?: string;
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
  isFeatured?: boolean;
  slug?: string;
  socialUrls?: SocialUrls;
}

export type DbApp = App & Document;

export interface AppDraft extends TimeStamps {
  appId: Types.ObjectId;
  name: string;
  jsonDesc?: unknown;
  shortDesc?: string;
  logoImg?: string;
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
  slug: string;
  imgUrl?: string;
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

export interface AppCommentSupport extends TimeStamps {
  accountId: Types.ObjectId;
  appId: Types.ObjectId;
  commentId: Types.ObjectId;
}

export type DbAppCommentSupport = AppCommentSupport & Document;
