import {
  Arg, Resolver, Query, Int, ID,
} from 'type-graphql';
import { CommentConnection } from '../../entities/Comments.js';
import MComment from '../../../db/MComment.js';
import MApp from '../../../../apps/db/MApp.js';
import { CommentStatus, CommentType } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Query(() => CommentConnection, { nullable: true })
  async comments(
    @Arg('refId', () => ID) refId: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('type', () => CommentType) type: string,
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 100,
    @Arg('page', () => Int, { nullable: true }) page = 1,
  ) {
    const dbFilter = {
      refId, type, parentCommentId: null, status: CommentStatus.published,
    };
    const totalCount = await MApp.count(dbFilter);
    const comments = await MComment.find(dbFilter)
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
