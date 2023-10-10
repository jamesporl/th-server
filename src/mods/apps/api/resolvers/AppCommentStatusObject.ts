import { Resolver, Root, FieldResolver } from 'type-graphql';
import appCommentStatusMap from '../../utils/constants/appCommentStatusMap.js';
import { AppCommentStatusObject } from '../entities/AppComments.js';
import { AppCommentStatus } from '../entities/_enums.js';

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
