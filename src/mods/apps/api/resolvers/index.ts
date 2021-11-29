import App from './App';
import AppDraft from './AppDraft';
import AppDraftStatusObject from './AppDraftStatusObject';
import AppStatusObject from './AppStatusObject';
import Mutation from './Mutation';
import Query from './Query';

export default [App, AppDraft, AppStatusObject, AppDraftStatusObject, ...Mutation, ...Query];
