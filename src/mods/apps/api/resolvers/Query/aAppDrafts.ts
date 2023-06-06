import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { MAppDraft } from 'mods/apps/db';
import IsAdmin from 'core/graphql/IsAdmin';
import { AppDraftConnection } from '../../entities/AppDrafts';
import { AppDraftStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @IsAdmin()
  @Query(() => AppDraftConnection, { nullable: true })
  async aAppDrafts(
    @Arg('searchString', { nullable: true }) searchString: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter: { [key: string]: unknown } = { status: { $ne: AppDraftStatus.deleted } };
    if (searchString) {
      const pattern = new RegExp(searchString, 'i');
      dbFilter.name = pattern;
    }

    const totalCount = await MAppDraft.count(dbFilter);
    const docs = await MAppDraft.find(dbFilter)
      .sort({ _id: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();

    return {
      totalCount,
      nodes: docs,
    };
  }
}
