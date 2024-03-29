import { Types, Document } from 'mongoose';
import { TimeStamps, AccountStamps, SocialUrls } from '../../base/db/_types';
import { AppDraftStatus, AppStatus } from '../api/entities/_enums';

export interface BannerImg {
  _id: Types.ObjectId;
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
  websiteUrl?: string;
  status: AppStatus;
  tagIds?: Types.ObjectId[];
  upvotesCount: number;
  commentsCount: number;
  isFeatured?: boolean;
  slug?: string;
  socialUrls?: SocialUrls;
  analytics?: {
    views?: number;
    websiteClicks?: number;
    facebookClicks?: number;
    instagramClicks?: number;
    linkedInClicks?: number;
    xClicks?: number;
    githubClicks?: number;
    threadsClicks?: number;
    tiktokClicks?: number;
  }
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
  websiteUrl?: string;
  tagIds?: Types.ObjectId[];
  socialUrls?: SocialUrls;
  submittedAt?: Date;
  status: AppDraftStatus;
}

export type DbAppDraft = AppDraft & Document;

export interface AppTag {
  name: string;
  slug: string;
  imgUrl?: string;
}

export type DbAppTag = AppTag & Document;
