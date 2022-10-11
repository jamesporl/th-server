import { model, Schema } from 'mongoose';
import ImageSchema from 'mods/base/db/common/Image';
import SocialUrlsSchema from 'mods/base/db/common/SocialUrls';
import { AppStatus, APP_STATUS_VALUES } from '../api/entities/_enums';
import { DbApp } from './_types';
import BannerImgSchema from './common/BannerImg';

const AppSchema = new Schema(
  {
    name: { type: String, required: true },
    shortDesc: { type: String, required: true },
    jsonDesc: { type: Schema.Types.Mixed },
    htmlDesc: { type: String },
    textDesc: { type: String },
    playStoreUrl: String,
    appStoreUrl: String,
    websiteUrl: String,
    publishedAt: Date,
    logoImg: ImageSchema,
    videoUrl: String,
    bannerImgs: [BannerImgSchema],
    ownedBy: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String, enum: APP_STATUS_VALUES, required: true, default: AppStatus.new,
    },
    slug: { type: String, index: true, unique: true },
    socialUrls: SocialUrlsSchema,
    commentsCount: { type: Number, default: 0 },
    supportsCount: { type: Number, default: 0 },
    tagIds: [Schema.Types.ObjectId],
    isFeatured: Boolean,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
  },
  {
    collection: 'App', timestamps: true,
  },
);

const MApp = model<DbApp>('App', AppSchema);

export default MApp;
