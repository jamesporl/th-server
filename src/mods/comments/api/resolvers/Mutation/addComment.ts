import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import serializeEditorContentToHtml from '../../../../apps/utils/serializeEditorContentToHtml.js';
import serializeEditorContentToText from '../../../../apps/utils/serializeEditorContentToText.js';
import { AddCommentInput } from '../../entities/Comments.js';
import { CommentType } from '../../entities/_enums.js';
import { MApp } from '../../../../apps/db/index.js';
import { AppStatus } from '../../../../apps/api/entities/_enums.js';
import MComment from '../../../db/MComment.js';
import Comment from '../../entities/Comment.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => Comment)
  async addComment(
    @Ctx() { accountId, dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => AddCommentInput) input: AddCommentInput,
  ) {
    const {
      refId, type, parentCommentId, jsonContent,
    } = input;
    if (type === CommentType.app) {
      const app = await MApp.findOne({ _id: refId, status: AppStatus.published });
      if (!app) {
        throw new UserInputError('App not found');
      }
    }

    if (parentCommentId) {
      const parentComment = await MComment.findOne({ _id: parentCommentId });
      if (!parentComment || parentComment.parentCommentId) {
        throw new UserInputError('Parent comment not found');
      }
    }

    const newComment = await new MComment({
      refId,
      type,
      jsonContent,
      htmlContent: serializeEditorContentToHtml(jsonContent),
      textContent: serializeEditorContentToText(jsonContent),
      parentCommentId,
      createdBy: accountId,
    }).save();

    if (parentCommentId) {
      dataloaders.childCommentsByParentIdLoader.clear(parentCommentId);
    }

    if (type === CommentType.app) {
      await MApp.updateOne({ _id: refId }, { $inc: { commentsCount: 1 } });
    }

    return newComment.toObject();
  }
}
