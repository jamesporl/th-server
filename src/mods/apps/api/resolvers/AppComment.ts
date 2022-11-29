import {
  Resolver, Root, FieldResolver, Ctx,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import { DbAppComment } from '../../db/_types';
import AppComment from '../entities/AppComment';

@Resolver(() => AppComment)
export default class {
  @FieldResolver()
  createdBy(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { createdBy }: DbAppComment,
  ) {
    return dataloaders.accountByIdLoader.load(createdBy.toHexString());
  }

  @FieldResolver()
  async comments(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { _id }: DbAppComment,
  ) {
    const childComments = await dataloaders.childCommentsByParentIdLoader.load(_id.toHexString());
    return {
      nodes: childComments,
      totalCount: childComments.length,
    };
  }

  @FieldResolver()
  isSupported(
    @Ctx() { dataloaders, accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { _id }: DbAppComment,
  ) {
    if (accountId) {
      return dataloaders.appCommentSupportLoader.load(`${_id}_${accountId}`);
    }
    return false;
  }

  @FieldResolver()
  isParent(
    @Root() { parentCommentId }: DbAppComment, // eslint-disable-line @typescript-eslint/indent
  ) {
    return !parentCommentId;
  }
}
