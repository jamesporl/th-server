import { model, Schema } from 'mongoose';
import SocialUrlsSchema from '../../base/db/common/SocialUrls.js';
import { AppStatus, APP_STATUS_VALUES } from '../api/entities/_enums.js';
import { DbApp } from './_types.js';
import BannerImgSchema from './common/BannerImg.js';

const AppAnalyticsSchema = new Schema({
  views: { type: Number, default: 0 },
  websiteClicks: { type: Number, default: 0 },
  facebookClicks: { type: Number, default: 0 },
  instagramClicks: { type: Number, default: 0 },
  linkedInClicks: { type: Number, default: 0 },
  xClicks: { type: Number, default: 0 },
  githubClicks: { type: Number, default: 0 },
  threadsClicks: { type: Number, default: 0 },
  tiktokClicks: { type: Number, default: 0 },
}, { _id: false });

const AppSchema = new Schema(
  {
    name: { type: String, required: true },
    shortDesc: { type: String, required: true },
    jsonDesc: { type: Schema.Types.Mixed },
    htmlDesc: { type: String },
    textDesc: { type: String },
    websiteUrl: String,
    publishedAt: Date,
    logoImg: String,
    videoUrl: String,
    bannerImgs: [BannerImgSchema],
    ownedBy: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String, enum: APP_STATUS_VALUES, required: true, default: AppStatus.new,
    },
    randomId: { type: Number, required: true },
    slug: { type: String, index: true, unique: true },
    socialUrls: SocialUrlsSchema,
    commentsCount: { type: Number, default: 0 },
    upvotesCount: { type: Number, default: 0 },
    tagIds: [Schema.Types.ObjectId],
    isFeatured: Boolean,
    analytics: { type: AppAnalyticsSchema },
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
  },
  {
    collection: 'App', timestamps: true,
  },
);

const MApp = model<DbApp>('App', AppSchema);

export default MApp;
