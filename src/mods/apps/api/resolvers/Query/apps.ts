import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { MApp } from '../../../db';
import { AppConnection } from '../../entities/Apps';
import { AppsOtherFilter, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Query(() => AppConnection, { nullable: true })
  async apps(
    @Arg('searchString', { nullable: true }) searchString: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('publishedFromDate', () => GraphQLDateTime, { nullable: true })
    publishedFromDate?: Date,
    @Arg('publishedToDate', () => GraphQLDateTime, { nullable: true })
    publishedToDate?: Date,
    @Arg('otherFilters', () => [AppsOtherFilter], { nullable: true })
    otherFilters?: AppsOtherFilter[],
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter: { [key: string]: unknown } = {};
    if (searchString) {
      const pattern = new RegExp(searchString, 'i');
      dbFilter.name = pattern;
    }

    if (publishedFromDate || publishedToDate) {
      const publishedAtFilter: { [key: string]: unknown } = {};
      if (publishedFromDate) {
        publishedAtFilter.$gte = new Date(publishedFromDate);
      }
      if (publishedToDate) {
        publishedAtFilter.$lte = new Date(publishedToDate);
      }
      dbFilter.publishedAt = publishedAtFilter;
    }

    if (otherFilters?.length) {
      if (otherFilters.includes(AppsOtherFilter.isFeatured)) {
        dbFilter.isFeatured = true;
      }
      if (otherFilters.includes(AppsOtherFilter.excludeFeatured)) {
        dbFilter.isFeatured = { $ne: true };
      }
    }

    // if (publishedFromDate )
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
