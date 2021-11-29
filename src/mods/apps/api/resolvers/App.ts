import { Resolver, Root, FieldResolver, Ctx } from 'type-graphql';
import { Context } from 'core/graphql/_types';
import { DbAppDraft } from '../../db/_types';
import { AppDraft } from '../entities/Apps';

@Resolver(() => AppDraft)
export default class {
  @FieldResolver()
  tags(
    @Ctx() { dataloaders }: Context,
    @Root() { tagIds }: DbAppDraft
  ) {
    if (tagIds?.length) {
      const tagIdStrs = tagIds.map((tagId) => tagId.toHexString());
      return dataloaders.tagByIdLoader.loadMany(tagIdStrs);
    }
    return [];
  }
}
