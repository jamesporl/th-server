import { Image } from 'mods/base/db/_types';
import { Types, Document } from 'mongoose';
import { AppDraftStatus, AppStatus } from '../api/entities/_enums';

export interface BannerImg {
  order: number;
  image: Image;
}

export interface App {
  name: string;
  desc?: string;
  shortDesc?: string;
  logoImg?: Image;
  videoUrl?: string;
  bannerImgs?: BannerImg[];
  ownedBy: Types.ObjectId;
  publishDate?: Date;
  playStoreUrl?: string;
  appStoreUrl?: string;
  websiteUrl?: string;
  status: AppStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export type DbApp = App & Document;

export interface AppDraft {
  appId: Types.ObjectId;
  name: string;
  desc?: string;
  shortDesc?: string;
  logoImg?: Image;
  videoUrl?: string;
  bannerImgs?: BannerImg[];
  ownedBy: Types.ObjectId;
  publishDate?: Date;
  playStoreUrl: string;
  appStoreUrl: string;
  websiteUrl: string;
}

export type DbAppDraft = AppDraft & Document;
