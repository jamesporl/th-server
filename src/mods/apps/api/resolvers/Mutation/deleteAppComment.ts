import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import { MApp, MAppComment } from '../../../db';
import { AppCommentStatus, AppStatus } from '../../entities/_enums';
import { DeleteAppCommentInput } from '../../entities/AppComments';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async deleteAppComment(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => DeleteAppCommentInput) input: DeleteAppCommentInput,
  ) {
    const { commentId } = input;
    const comment = await MAppComment.findOne({
      _id: commentId,
      createdBy: accountId,
      status: AppCommentStatus.published,
    });

    if (!comment) {
      throw new UserInputError('Comment not found');
    }

    const app = await MApp.findOne({ _id: comment.appId });

    if (app.status !== AppStatus.published) {
      throw new UserInputError('App is not published');
    }

    await MAppComment.updateOne({ _id: commentId }, { $set: { status: AppCommentStatus.deleted } });
    await MApp.updateOne({ _id: app._id }, { $inc: { commentsCount: -1 } });

    return { isCompleted: true };
  }
}
