import { model, Schema } from 'mongoose';
import { AppCommentStatus, APP_COMMENT_STATUS_VALUES } from '../api/entities/_enums';
import { DbAppComment } from './_types';

const AppCommentSchema = new Schema(
  {
    appId: { type: Schema.Types.ObjectId, required: true },
    parentCommentId: Schema.Types.ObjectId,
    jsonContent: Schema.Types.Mixed,
    htmlContent: String,
    textContent: String,
    isPinned: Boolean,
    createdBy: Schema.Types.ObjectId,
    supportsCount: { type: Number, default: 0 },
    status: { type: String, enum: APP_COMMENT_STATUS_VALUES, default: AppCommentStatus.published },
  },
  {
    collection: 'AppComment', timestamps: true,
  },
);

const MAppComment = model<DbAppComment>('AppComment', AppCommentSchema);

export default MAppComment;
