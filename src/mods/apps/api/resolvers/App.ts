import {
  Resolver, Root, FieldResolver, Ctx,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import { DbApp } from '../../db/_types';
import { App } from '../entities/Apps';

@Resolver(() => App)
export default class {
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
