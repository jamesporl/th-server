import App from './App.js';
import AppComment from './AppComment.js';
import AppCommentStatusObject from './AppCommentStatusObject.js';
import AppDraft from './AppDraft.js';
import AppDraftStatusObject from './AppDraftStatusObject.js';
import AppStatusObject from './AppStatusObject.js';
import Mutation from './Mutation/index.js';
import Query from './Query/index.js';

export default [
  App,
  AppComment,
  AppCommentStatusObject,
  AppDraft,
  AppStatusObject,
  AppDraftStatusObject,
  ...Mutation,
  ...Query,
];
