import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MApp, MAppComment, MAppCommentSupport } from '../../../db/index.js';
import { AppCommentStatus, AppStatus } from '../../entities/_enums.js';
import { ToggleAppCommentSupportInput } from '../../entities/AppComments.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async toggleAppCommentSupport(
    @Ctx() { accountId, dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => ToggleAppCommentSupportInput) input: ToggleAppCommentSupportInput,
  ) {
    const { commentId } = input;

    const comment = await MAppComment.findOne({
      _id: commentId, status: AppCommentStatus.published,
    });
    if (!comment) {
      throw new UserInputError('Comment not found');
    }

    const app = await MApp.findOne({ _id: comment.appId, status: AppStatus.published });
    if (!app) {
      throw new UserInputError('App not found');
    }

    const supportDoc = await MAppCommentSupport.findOne({ commentId, accountId });
    if (supportDoc) {
      await MAppCommentSupport.deleteOne({ _id: supportDoc._id });
      await MAppComment.updateOne({ _id: commentId }, { $inc: { supportsCount: -1 } });
    } else {
      await new MAppCommentSupport({ appId: comment.appId, commentId, accountId }).save();
      await MAppComment.updateOne({ _id: commentId }, { $inc: { supportsCount: 1 } });
    }

    dataloaders.appCommentSupportLoader.clear(`${commentId}_${accountId}`);

    return { isCompleted: true };
  }
}
