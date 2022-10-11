import {
  Resolver, Root, FieldResolver, Ctx,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import serializeEditorContentToHtml from 'mods/apps/utils/serializeEditorContentToHtml';
import { DbAppDraft } from '../../db/_types';
import { AppDraft } from '../entities/AppDrafts';

@Resolver(() => AppDraft)
export default class {
  @FieldResolver()
  ownedBy(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { ownedBy }: DbAppDraft,
  ) {
    return dataloaders.accountByIdLoader.load(ownedBy.toHexString());
  }

  @FieldResolver()
  tags(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { tagIds }: DbAppDraft,
  ) {
    if (tagIds?.length) {
      const tagIdStrs = tagIds.map((tagId) => tagId.toHexString());
      return dataloaders.tagByIdLoader.loadMany(tagIdStrs);
    }
    return [];
  }

  @FieldResolver()
  htmlDesc(
    @Root() { jsonDesc }: DbAppDraft, // eslint-disable-line @typescript-eslint/indent
  ) {
    return serializeEditorContentToHtml(jsonDesc);
  }
}
