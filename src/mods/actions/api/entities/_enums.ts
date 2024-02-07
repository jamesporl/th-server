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

export enum UpvoteType {
  app = 'app',
  comment = 'comment',
}

registerEnumType(UpvoteType, { name: 'UpvoteType' });
export const UPVOTE_TYPE_VALUES = Object.values(UpvoteType);

export enum AnalyticsEventType {
  appView = 'appView',
  appWebsiteClick = 'appWebsiteClick',
  appFacebookClick = 'appFacebookClick',
  appInstagramClick = 'appInstagramClick',
  appTwitterClick = 'appTwitterClick',
  appLinkedInClick = 'appLinkedInClick',
  appGithubClick = 'appGithubClick',
}

registerEnumType(AnalyticsEventType, { name: 'AnalyticsEventType' });
export const ANALYTICS_EVENT_TYPE_VALUES = Object.values(AnalyticsEventType);
