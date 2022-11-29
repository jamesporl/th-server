import { ForbiddenError, UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import Auth from 'core/graphql/Auth';
import { MApp, MAppComment } from '../../../db';
import { TogglePinAppCommentInput } from '../../entities/AppComments';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async togglePinAppComment(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => TogglePinAppCommentInput) input: TogglePinAppCommentInput,
  ) {
    const { commentId } = input;

    const comment = await MAppComment.findOne({ _id: commentId });
    if (!comment) {
      throw new UserInputError('Comment not found');
    }
    if (comment.parentCommentId) {
      throw new UserInputError('Cannot pin a child comment');
    }

    const app = await MApp.findOne({ _id: comment.appId });
    if (app.ownedBy.toHexString() !== accountId) {
      throw new ForbiddenError('Only the owner of the app can pin comments');
    }

    await MAppComment.updateOne({ _id: commentId }, { $set: { isPinned: !comment.isPinned } });

    return { isCompleted: true };
  }
}
