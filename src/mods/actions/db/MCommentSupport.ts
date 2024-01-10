import { model, Schema } from 'mongoose';
import { DbCommentSupport } from './_types';
import { COMMENT_TYPE_VALUES, CommentType } from '../api/entities/_enums.js';

const CommentSupportSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, required: true, index: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    commentId: { type: Schema.Types.ObjectId, required: true, index: true },
    supportsCount: { type: Number, default: 0 },
    type: {
      type: String,
      required: true,
      enum: COMMENT_TYPE_VALUES,
      default: CommentType.app,
    },
  },
  { collection: 'CommentSupport', timestamps: true },
);

const MCommentSupport = model<DbCommentSupport>('CommentSupport', CommentSupportSchema);

export default MCommentSupport;
