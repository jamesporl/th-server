import { model, Schema } from 'mongoose';
import { CommentStatus, COMMENT_STATUS_VALUES, COMMENT_TYPE_VALUES } from '../api/entities/_enums.js';
import { DbComment } from './_types.js';

const CommentSchema = new Schema(
  {
    parentCommentId: { type: Schema.Types.ObjectId, index: true },
    jsonContent: Schema.Types.Mixed,
    htmlContent: { type: String, required: true },
    textContent: String,
    isPinned: { type: Boolean, default: false },
    createdBy: Schema.Types.ObjectId,
    upvotesCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: COMMENT_STATUS_VALUES,
      default: CommentStatus.published,
      required: true,
    },
    refId: { type: Schema.Types.ObjectId, required: true },
    type: {
      type: String,
      required: true,
      enum: COMMENT_TYPE_VALUES,
    },
  },
  {
    collection: 'Comment', timestamps: true,
  },
);

const MComment = model<DbComment>('Comment', CommentSchema);

export default MComment;
