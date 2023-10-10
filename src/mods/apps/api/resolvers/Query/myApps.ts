import {
  Arg, Resolver, Ctx, Query, Int,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MApp } from '../../../db/index.js';
import { AppConnection } from '../../entities/Apps.js';
import { AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Query(() => AppConnection, { nullable: true })
  async myApps(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter = {
      ownedBy: accountId,
      status: { $in: [AppStatus.published, AppStatus.unpublished] },
    };
    const totalCount = await MApp.count(dbFilter);
    const apps = await MApp.find(dbFilter)
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
