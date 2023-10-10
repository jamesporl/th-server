import { Resolver, Root, FieldResolver } from 'type-graphql';
import appStatusMap from '../../utils/constants/appStatusMap.js';
import { AppStatusObject } from '../entities/Apps.js';
import { AppStatus } from '../entities/_enums.js';

@Resolver(() => AppStatusObject)
export default class {
  @FieldResolver()
  key(@Root() status: AppStatus) {
    return status;
  }

  @FieldResolver()
  label(@Root() status: AppStatus) {
    return appStatusMap.get(status);
  }
}
