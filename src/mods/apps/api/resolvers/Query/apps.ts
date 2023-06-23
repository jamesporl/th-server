import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { UserInputError } from 'apollo-server-express';
import { SortOrder } from 'mongoose';
import { MApp, MAppTag } from '../../../db';
import { AppConnection } from '../../entities/Apps';
import { AppsOtherFilter, AppsSortBy, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Query(() => AppConnection, { nullable: true })
  async apps(
    @Arg('searchString', { nullable: true }) searchString: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('publishedFromDate', () => GraphQLDateTime, { nullable: true })
    publishedFromDate?: Date,
    @Arg('publishedToDate', () => GraphQLDateTime, { nullable: true })
    publishedToDate?: Date,
    @Arg('tagSlug', { nullable: true }) tagSlug?: string,
    @Arg('otherFilters', () => [AppsOtherFilter], { nullable: true })
    otherFilters?: AppsOtherFilter[],
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
    @Arg('sortBy', () => AppsSortBy, { nullable: true }) sortBy = AppsSortBy.random,
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

    if (tagSlug) {
      const appTag = await MAppTag.findOne({ slug: tagSlug });
      if (!appTag) {
        throw new UserInputError('Tag not found');
      }
      dbFilter.tagIds = appTag._id;
    }

    if (otherFilters?.length) {
      if (otherFilters.includes(AppsOtherFilter.isFeatured)) {
        dbFilter.isFeatured = true;
      }
      if (otherFilters.includes(AppsOtherFilter.excludeFeatured)) {
        dbFilter.isFeatured = { $ne: true };
      }
    }

    dbFilter.status = AppStatus.published;

    let dbSort: { [key:string]: SortOrder } = { randomId: 1 };
    if (sortBy === AppsSortBy.publishedDate) {
      dbSort = { publishedAt: -1, _id: -1 };
    } else if (sortBy === AppsSortBy.name) {
      dbSort = { name: 1 };
    }

    const totalCount = await MApp.count(dbFilter);
    const apps = await MApp.find(dbFilter)
      .sort(dbSort)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();

    return {
      totalCount,
      nodes: apps,
    };
  }
}
