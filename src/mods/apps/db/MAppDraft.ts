import { model, Schema } from 'mongoose';
import SocialUrlsSchema from '../../base/db/common/SocialUrls.js';
import { DbAppDraft } from './_types.js';
import BannerImgSchema from './common/BannerImg.js';
import { AppDraftStatus, APP_DRAFT_STATUS_VALUES } from '../api/entities/_enums.js';

const AppDraftSchema = new Schema(
  {
    appId: { type: Schema.Types.ObjectId, required: true },
    name: String,
    jsonDesc: { type: Schema.Types.Mixed },
    shortDesc: String,
    websiteUrl: String,
    logoImg: String,
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
