import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import { DeleteCommentInput } from '../../entities/Comments.js';
import MComment from '../../../db/MComment.js';
import { CommentStatus, CommentType } from '../../entities/_enums.js';
import { MApp } from '../../../../apps/db/index.js';
import { AppStatus } from '../../../../apps/api/entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async deleteComment(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => DeleteCommentInput) input: DeleteCommentInput,
  ) {
    const { commentId } = input;
    const comment = await MComment.findOne({
      _id: commentId,
      createdBy: accountId,
      status: CommentStatus.published,
    });

    if (!comment) {
      throw new UserInputError('Comment not found');
    }

    if (comment.type === CommentType.app) {
      const app = await MApp.findOne({ _id: comment.refId });
      if (app.status !== AppStatus.published) {
        throw new UserInputError('App is not published');
      }
    }

    await MComment.updateOne({ _id: commentId }, { $set: { status: CommentStatus.deleted } });

    if (comment.type === CommentType.app) {
      await MApp.updateOne({ _id: comment.refId }, { $inc: { commentsCount: -1 } });
    }

    return { isCompleted: true };
  }
}
