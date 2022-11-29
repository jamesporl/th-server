import {
  Arg, Resolver, Query, Int, ID,
} from 'type-graphql';
import { MApp, MAppComment } from '../../../db';
import { AppCommentConnection } from '../../entities/AppComments';

@Resolver()
export default class {
  @Query(() => AppCommentConnection, { nullable: true })
  async appComments(
    @Arg('appId', () => ID, { nullable: true }) appId: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter = { appId, parentCommentId: null };
    const totalCount = await MApp.count(dbFilter);
    const comments = await MAppComment.find(dbFilter)
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();

    return {
      totalCount,
      nodes: comments,
    };
  }
}
