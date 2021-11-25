import { Resolver, Root, FieldResolver } from 'type-graphql';
import appStatusMap from '../../utils/constants/appStatusMap';
import { AppStatusObject } from '../entities/Apps';
import { AppStatus } from '../entities/_enums';

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
