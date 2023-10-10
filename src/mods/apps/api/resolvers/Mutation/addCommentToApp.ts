import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import serializeEditorContentToHtml from '../../../utils/serializeEditorContentToHtml.js';
import serializeEditorContentToText from '../../../utils/serializeEditorContentToText.js';
import { MApp, MAppComment } from '../../../db/index.js';
import { AppStatus } from '../../entities/_enums.js';
import { AddCommentToAppInput } from '../../entities/AppComments.js';
import AppComment from '../../entities/AppComment.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppComment)
  async addCommentToApp(
    @Ctx() { accountId, dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => AddCommentToAppInput) input: AddCommentToAppInput,
  ) {
    const { appId, parentCommentId, jsonContent } = input;
    const app = await MApp.findOne({ _id: appId, status: AppStatus.published });
    if (!app) {
      throw new UserInputError('App not found');
    }

    if (parentCommentId) {
      const parentComment = await MAppComment.findOne({ _id: parentCommentId });
      if (!parentComment || parentComment.parentCommentId) {
        throw new UserInputError('Parent comment not found');
      }
    }

    const newComment = await new MAppComment({
      appId,
      jsonContent,
      htmlContent: serializeEditorContentToHtml(jsonContent),
      textContent: serializeEditorContentToText(jsonContent),
      parentCommentId,
      createdBy: accountId,
    }).save();

    if (parentCommentId) {
      dataloaders.childCommentsByParentIdLoader.clear(parentCommentId);
    }

    await MApp.updateOne({ _id: appId }, { $inc: { commentsCount: 1 } });

    return newComment.toObject();
  }
}
