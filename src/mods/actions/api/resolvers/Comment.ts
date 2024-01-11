import {
  Resolver, Root, FieldResolver, Ctx,
} from 'type-graphql';
import { Context } from '../../../../core/graphql/_types.js';
import Comment from '../entities/Comment.js';
import { DbComment } from '../../db/_types.js';
import { UpvoteType } from '../entities/_enums.js';

@Resolver(() => Comment)
export default class {
  @FieldResolver()
  createdBy(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { createdBy }: DbComment,
  ) {
    return dataloaders.accountByIdLoader.load(createdBy.toHexString());
  }

  @FieldResolver()
  async comments(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { _id }: DbComment,
  ) {
    const childComments = await dataloaders.childCommentsByParentIdLoader.load(_id.toHexString());
    return {
      nodes: childComments,
      totalCount: childComments.length,
    };
  }

  @FieldResolver()
  isUpvoted(
    @Ctx() { dataloaders, accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { _id }: DbComment,
  ) {
    if (accountId) {
      return dataloaders.upvotesLoader.load(`${_id}_${UpvoteType.comment}_${accountId}`);
    }
    return false;
  }

  @FieldResolver()
  isParent(
    @Root() { parentCommentId }: DbComment, // eslint-disable-line @typescript-eslint/indent
  ) {
    return !parentCommentId;
  }
}
