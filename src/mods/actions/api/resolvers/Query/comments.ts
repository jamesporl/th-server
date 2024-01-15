import {
  Arg, Resolver, Query, Int, ID,
} from 'type-graphql';
import MComment from '../../../db/MComment.js';
import { CommentStatus, CommentType } from '../../entities/_enums.js';
import { Comments } from '../../entities/Comments.js';

@Resolver()
export default class {
  @Query(() => Comments, { nullable: true })
  async comments(
    @Arg('refId', () => ID) refId: string, // eslint-disable-line @typescript-eslint/indent
    @Arg('parentCommentId', () => ID, { nullable: true })
    parentCommentId: string,
    @Arg('type', () => CommentType) type: string,
    @Arg('isPinned', () => Boolean) isPinned: boolean,
    @Arg('pageSize', () => Int, { nullable: true }) pageSize = 10,
    @Arg('childCommentsPageSize', () => Int, { nullable: true }) childCommentsPageSize = 10,
    @Arg('lastId', () => ID, { nullable: true }) lastId?: string,
  ) {
    const dbFilter: { [key: string]: unknown } = {};

    if (lastId) {
      dbFilter._id = { $lt: lastId };
    }

    dbFilter.refId = refId;
    dbFilter.type = type;
    dbFilter.stats = CommentStatus.published;

    if (parentCommentId) {
      dbFilter.parentCommentId = parentCommentId;
    } else {
      dbFilter.parentCommentId = { $exists: false };
      dbFilter.isPinned = isPinned;
    }

    const commentDocs = await MComment.find(dbFilter)
      .sort({ _id: -1 })
      .limit(pageSize)
      .lean();

    let nodes = commentDocs;

    if (!parentCommentId) {
      nodes = await Promise.all(commentDocs.map(async (c) => {
        const childComments = await MComment.find({
          parentCommentId: c._id,
          status: CommentStatus.published,
        })
          .sort({ _id: -1 })
          .limit(childCommentsPageSize)
          .lean();
        let hasMoreChildComments = false;
        if (childComments.length === childCommentsPageSize) {
          const lastChildComment = childComments[childCommentsPageSize - 1];
          hasMoreChildComments = !!(await MComment.findOne({
            parentCommentId: c._id,
            _id: { $lt: lastChildComment._id },
            status: CommentStatus.published,
          }));
        }
        return {
          ...c,
          comments: childComments.length ? {
            nodes: childComments,
            hasMore: hasMoreChildComments,
          } : undefined,
        };
      }));
    }

    let hasMore = false;
    if (commentDocs.length) {
      const lastComment = commentDocs[commentDocs.length - 1];
      dbFilter._id = { $lt: lastComment._id };
      hasMore = !!(await MComment.findOne(dbFilter));
    }

    return {
      hasMore,
      nodes,
    };
  }
}
