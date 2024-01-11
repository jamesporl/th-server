import { Types, Document } from 'mongoose';
import { TimeStamps } from '../../base/db/_types.js';
import { CommentStatus, CommentType, UpvoteType } from '../api/entities/_enums.js';

export interface Comment extends TimeStamps {
  refId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  jsonContent?: unknown;
  htmlContent?: string;
  textContent?: string;
  upvotesCount?: number;
  isPinned?: boolean;
  status: CommentStatus;
  type: CommentType;
  createdBy: Types.ObjectId;
}

export type DbComment = Comment & Document;

export interface Upvote extends TimeStamps {
  accountId: Types.ObjectId;
  refId: Types.ObjectId;
  type: UpvoteType;
}

export type DbUpvote = Upvote & Document;
