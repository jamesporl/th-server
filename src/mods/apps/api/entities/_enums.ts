import 'reflect-metadata';
import { registerEnumType } from 'type-graphql';

export enum AppStatus {
  new = 'new', // newly created, app draft is in progress status
  waiting = 'waiting', // app draft is submitted/locked, app waiting for publication
  published = 'published', // app draft set to published, app is published
  unpublished = 'unpublished', // new app draft with in progress status, app is unpublished
  deleted = 'deleted', // app and appDraft are in deleted status
}

registerEnumType(AppStatus, { name: 'AppStatus' });
export const APP_STATUS_VALUES = Object.values(AppStatus);

export enum AppDraftStatus {
  inProgress = 'inProgress',
  submitted = 'submitted',
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
  name = 'name',
  publishedDate = 'publishedDate',
}

registerEnumType(AppsSortBy, { name: 'AppsSortBy' });
