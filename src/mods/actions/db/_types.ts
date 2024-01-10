import { Types, Document } from 'mongoose';
import { TimeStamps } from '../../base/db/_types.js';
import { CommentStatus, CommentType } from '../api/entities/_enums.js';

export interface Comment extends TimeStamps {
  refId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  jsonContent?: unknown;
  htmlContent?: string;
  textContent?: string;
  supportsCount?: number;
  isPinned?: boolean;
  status: CommentStatus;
  type: CommentType;
  createdBy: Types.ObjectId;
}

export type DbComment = Comment & Document;

export interface CommentSupport extends TimeStamps {
  accountId: Types.ObjectId;
  refId: Types.ObjectId;
  type: CommentType;
  commentId: Types.ObjectId;
}

export type DbCommentSupport = CommentSupport & Document;
