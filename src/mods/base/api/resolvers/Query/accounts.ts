import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import IsAdmin from 'core/graphql/IsAdmin';
import { MAccount } from '../../../db';
import { AccountConnection } from '../../entities/Account';

@Resolver()
export default class {
  @IsAdmin()
  @Query(() => AccountConnection, { nullable: true })
  async accounts(
    @Arg('searchString', { nullable: true }) searchString: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter: { [key: string]: unknown } = {};
    if (searchString) {
      const pattern = new RegExp(searchString, 'i');
      dbFilter.name = pattern;
    }

    const totalCount = await MAccount.count(dbFilter);
    const docs = await MAccount.find(dbFilter)
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
