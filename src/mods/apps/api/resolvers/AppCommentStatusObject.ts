import { Resolver, Root, FieldResolver } from 'type-graphql';
import appCommentStatusMap from '../../utils/constants/appCommentStatusMap';
import { AppCommentStatusObject } from '../entities/AppComments';
import { AppCommentStatus } from '../entities/_enums';

@Resolver(() => AppCommentStatusObject)
export default class {
  @FieldResolver()
  key(@Root() status: AppCommentStatus) {
    return status;
  }

  @FieldResolver()
  label(@Root() status: AppCommentStatus) {
    return appCommentStatusMap.get(status);
  }
}
