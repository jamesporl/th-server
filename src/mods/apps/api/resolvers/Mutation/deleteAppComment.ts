import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import { MApp, MAppComment } from '../../../db/index.js';
import { AppCommentStatus, AppStatus } from '../../entities/_enums.js';
import { DeleteAppCommentInput } from '../../entities/AppComments.js';

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
