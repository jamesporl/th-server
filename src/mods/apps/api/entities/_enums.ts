import 'reflect-metadata';
import { registerEnumType } from 'type-graphql';

export enum AppStatus {
  new = 'new',
  waiting = 'waiting',
  published = 'published',
  deleted = 'deleted',
}

registerEnumType(AppStatus, { name: 'AppStatus' });
export const APP_STATUS_VALUES = Object.values(AppStatus);

export enum AppDraftStatus {
  inProgress = 'inProgress',
  submitted = 'submitted',
  approved = 'approved',
  published = 'published',
  deleted = 'deleted',
}

registerEnumType(AppDraftStatus, { name: 'AppDraftStatus' });
export const APP_DRAFT_STATUS_VALUES = Object.values(AppDraftStatus);

export enum AppCommentStatus {
  published = 'published',
  deleted = 'deleted',
}

registerEnumType(AppCommentStatus, { name: 'AppCommentStatus' });
export const APP_COMMENT_STATUS_VALUES = Object.values(AppCommentStatus);

export enum AppsOtherFilter {
  isFeatured = 'isFeatured',
  excludeFeatured = 'excludeFeatured',
}

registerEnumType(AppsOtherFilter, { name: 'AppsOtherFilter' });

export enum AppsSortBy {
  random = 'random',
  relevance = 'relevance',
  publishedDate = 'publishedDate',
}

registerEnumType(AppsSortBy, { name: 'AppsSortBy' });
