import { model, Schema } from 'mongoose';
import { DbAppCommentSupport } from './_types';

const AppCommentSupportSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, required: true, index: true },
    appId: { type: Schema.Types.ObjectId, required: true, index: true },
    commentId: { type: Schema.Types.ObjectId, required: true, index: true },
    supportsCount: { type: Number, default: 0 },
  },
  { collection: 'AppCommentSupport', timestamps: true },
);

const MAppCommentSupport = model<DbAppCommentSupport>('AppCommentSupport', AppCommentSupportSchema);

export default MAppCommentSupport;
