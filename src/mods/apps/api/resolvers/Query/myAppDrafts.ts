import { Arg, Resolver, Ctx, Query, Int } from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import { MAppDraft } from '../../../db';
import { AppDraftConnection } from '../../entities/Apps';
import { AppDraftStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Query(() => AppDraftConnection, { nullable: true })
  async myAppDrafts(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter = {
      ownedBy: accountId,
      status: { $nin: [AppDraftStatus.deleted, AppDraftStatus.published] },
    };
    const totalCount = await MAppDraft.count(dbFilter);
    const apps = await MAppDraft.find(dbFilter)
      .sort({ _id: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    return {
      totalCount,
      nodes: apps,
    };
  }
}
