import 'reflect-metadata';
import { registerEnumType } from 'type-graphql';

export enum CommentStatus {
  published = 'published',
  deleted = 'deleted',
}

registerEnumType(CommentStatus, { name: 'CommentStatus' });
export const COMMENT_STATUS_VALUES = Object.values(CommentStatus);

export enum CommentType {
  app = 'app',
  post = 'post',
}

registerEnumType(CommentType, { name: 'CommentType' });
export const COMMENT_TYPE_VALUES = Object.values(CommentType);
