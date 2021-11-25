import { model, Schema } from 'mongoose';
import ImageSchema from 'mods/base/db/common/Image';
import { DbAppDraft } from './_types';
import BannerImgSchema from './common/BannerImg';
import { AppDraftStatus, APP_DRAFT_STATUS_VALUES } from '../api/entities/_enums';

const AppDraftSchema = new Schema(
  {
    appId: { type: Schema.Types.ObjectId, required: true },
    name: String,
    desc: String,
    shortDesc: String,
    playStoreUrl: String,
    appStoreUrl: String,
    websiteUrl: String,
    publishDate: Date,
    logoImg: ImageSchema,
    videoUrl: String,
    bannerImgs: [BannerImgSchema],
    status: {
      type: String,
      enum: APP_DRAFT_STATUS_VALUES,
      required: true,
      default: AppDraftStatus.inProgress,
    },
    ownedBy: { type: Schema.Types.ObjectId, required: true },
  },
  {
    collection: 'AppDraft', timestamps: true,
  },
);

const MAppDraft = model<DbAppDraft>('AppDraft', AppDraftSchema);

export default MAppDraft;
