import { Resolver, Root, FieldResolver } from 'type-graphql';
import appDraftStatusMap from '../../utils/constants/appDraftStatusMap.js';
import { AppDraftStatusObject } from '../entities/AppDrafts.js';
import { AppDraftStatus } from '../entities/_enums.js';

@Resolver(() => AppDraftStatusObject)
export default class {
  @FieldResolver()
  key(@Root() status: AppDraftStatus) {
    return status;
  }

  @FieldResolver()
  label(@Root() status: AppDraftStatus) {
    return appDraftStatusMap.get(status);
  }
}
