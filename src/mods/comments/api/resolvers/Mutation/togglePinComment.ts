import { ForbiddenError, UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MApp } from '../../../../apps/db/index.js';
import { TogglePinCommentInput } from '../../entities/Comments.js';
import { MComment } from '../../../db/index.js';
import { CommentStatus, CommentType } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async togglePinComment(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => TogglePinCommentInput) input: TogglePinCommentInput,
  ) {
    const { commentId } = input;

    const comment = await MComment.findOne({ _id: commentId, status: CommentStatus.published });
    if (!comment) {
      throw new UserInputError('Comment not found');
    }
    if (comment.parentCommentId) {
      throw new UserInputError('Cannot pin a child comment');
    }

    if (comment.type === CommentType.app) {
      const app = await MApp.findOne({ _id: comment.refId });
      if (app.ownedBy.toHexString() !== accountId.toHexString()) {
        throw new ForbiddenError('Only the owner of the app can pin comments');
      }
    }

    await MComment.updateOne({ _id: commentId }, { $set: { isPinned: !comment.isPinned } });

    return { isCompleted: true };
  }
}
