import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { MApp } from '../../../db';
import { AppConnection } from '../../entities/Apps';
import { AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Query(() => AppConnection, { nullable: true })
  async apps(
    @Arg('searchString', { nullable: true }) searchString: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter: { [key: string]: unknown } = {};
    if (searchString) {
      const pattern = new RegExp(searchString, 'i');
      dbFilter.name = pattern;
    }
    dbFilter.status = AppStatus.published;

    const totalCount = await MApp.count(dbFilter);
    const apps = await MApp.find(dbFilter)
      .sort({ publishedAt: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();

    return {
      totalCount,
      nodes: apps,
    };
  }
}
