import { model, Schema } from 'mongoose';
import ImageSchema from 'mods/base/db/common/Image';
import SocialUrlsSchema from 'mods/base/db/common/SocialUrls';
import { DbAppDraft } from './_types';
import BannerImgSchema from './common/BannerImg';
import { AppDraftStatus, APP_DRAFT_STATUS_VALUES } from '../api/entities/_enums';

const AppDraftSchema = new Schema(
  {
    appId: { type: Schema.Types.ObjectId, required: true },
    name: String,
    jsonDesc: { type: Schema.Types.Mixed },
    shortDesc: String,
    playStoreUrl: String,
    appStoreUrl: String,
    websiteUrl: String,
    logoImg: ImageSchema,
    videoUrl: String,
    bannerImgs: [BannerImgSchema],
    status: {
      type: String,
      enum: APP_DRAFT_STATUS_VALUES,
      required: true,
      default: AppDraftStatus.inProgress,
    },
    socialUrls: SocialUrlsSchema,
    ownedBy: { type: Schema.Types.ObjectId, required: true },
    submittedAt: Date,
    tagIds: [Schema.Types.ObjectId],
  },
  {
    collection: 'AppDraft', timestamps: true,
  },
);

const MAppDraft = model<DbAppDraft>('AppDraft', AppDraftSchema);

export default MAppDraft;
