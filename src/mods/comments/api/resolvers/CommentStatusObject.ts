import { Resolver, Root, FieldResolver } from 'type-graphql';
import { CommentStatusObject } from '../entities/Comments.js';
import commentStatusMap from '../../utils/constants/commentStatusMap.js';
import { CommentStatus } from '../entities/_enums.js';

@Resolver(() => CommentStatusObject)
export default class {
  @FieldResolver()
  key(@Root() status: CommentStatus) {
    return status;
  }

  @FieldResolver()
  label(@Root() status: CommentStatus) {
    return commentStatusMap.get(status);
  }
}
