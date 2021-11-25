import AppDraftStatusObject from './AppDraftStatusObject';
import AppStatusObject from './AppStatusObject';
import Mutation from './Mutation';
import Query from './Query';

export default [AppStatusObject, AppDraftStatusObject, ...Mutation, ...Query];
