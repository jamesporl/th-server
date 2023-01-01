import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { MAppTag } from '../../../db';
import { AppTagConnection } from '../../entities/AppTags';

@Resolver()
export default class {
  @Query(() => AppTagConnection, { nullable: true })
  async appTags(
    @Arg('searchString', { nullable: true }) searchString: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter: { [key: string]: unknown } = {};
    if (searchString) {
      const pattern = new RegExp(searchString, 'i');
      dbFilter.name = pattern;
    }

    const totalCount = await MAppTag.count(dbFilter);
    const tags = await MAppTag.find(dbFilter)
      .sort({ name: 1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    return {
      totalCount,
      nodes: tags,
    };
  }
}
