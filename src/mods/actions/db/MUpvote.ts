import { model, Schema } from 'mongoose';
import { DbUpvote } from './_types';
import { UPVOTE_TYPE_VALUES } from '../api/entities/_enums.js';

const UpvoteSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, required: true, index: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    type: {
      type: String,
      required: true,
      enum: UPVOTE_TYPE_VALUES,
    },
  },
  { collection: 'Upvote', timestamps: true },
);

const MUpvote = model<DbUpvote>('Upvote', UpvoteSchema);

export default MUpvote;
