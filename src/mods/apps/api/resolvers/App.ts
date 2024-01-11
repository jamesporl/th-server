import {
  Resolver, Root, FieldResolver, Ctx,
} from 'type-graphql';
import { DbApp } from '../../db/_types.js';
import { App } from '../entities/Apps.js';
import { Context } from '../../../../core/graphql/_types.js';
import { UpvoteType } from '../../../actions/api/entities/_enums.js';

@Resolver(() => App)
export default class {
  @FieldResolver()
  ownedBy(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { ownedBy }: DbApp,
  ) {
    return dataloaders.accountByIdLoader.load(ownedBy.toHexString());
  }

  @FieldResolver()
  tags(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { tagIds }: DbApp,
  ) {
    if (tagIds?.length) {
      const tagIdStrs = tagIds.map((tagId) => tagId.toHexString());
      return dataloaders.tagByIdLoader.loadMany(tagIdStrs);
    }
    return [];
  }

  @FieldResolver()
  isUpvoted(
    @Ctx() { dataloaders, accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { _id }: DbApp,
  ) {
    if (accountId) {
      return dataloaders.upvotesLoader.load(`${_id}_${UpvoteType.app}_${accountId}`);
    }
    return false;
  }
}
