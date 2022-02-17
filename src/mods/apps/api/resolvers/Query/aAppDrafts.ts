import Auth from 'core/graphql/Auth';
import { MAppDraft } from 'mods/apps/db';
import { RoleKey } from 'mods/base/api/entities/_enums';
import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { AppDraftConnection } from '../../entities/AppDrafts';
import { AppDraftStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth([RoleKey.staff])
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
