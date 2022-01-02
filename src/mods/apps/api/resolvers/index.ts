import App from './App';
import AppComment from './AppComment';
import AppCommentStatusObject from './AppCommentStatusObject';
import AppDraft from './AppDraft';
import AppDraftStatusObject from './AppDraftStatusObject';
import AppStatusObject from './AppStatusObject';
import Mutation from './Mutation';
import Query from './Query';

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
