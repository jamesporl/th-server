import {
  Resolver, Root, FieldResolver, Ctx,
} from 'type-graphql';
import { DbApp } from '../../db/_types.js';
import { App } from '../entities/Apps.js';
import { Context } from '../../../../core/graphql/_types.js';

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
  isSupported(
    @Ctx() { dataloaders, accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { _id }: DbApp,
  ) {
    if (accountId) {
      return dataloaders.appSupportLoader.load(`${_id}_${accountId}`);
    }
    return false;
  }
}
