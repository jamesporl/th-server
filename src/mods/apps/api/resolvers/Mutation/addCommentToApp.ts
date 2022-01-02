import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import { MApp, MAppComment } from '../../../db';
import { AppStatus } from '../../entities/_enums';
import { AddCommentToAppInput } from '../../entities/AppComments';
import AppComment from '../../entities/AppComment';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppComment)
  async addCommentToApp(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => AddCommentToAppInput) input: AddCommentToAppInput,
  ) {
    const { appId, parentCommentId, content } = input;
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
      content,
      parentCommentId,
      createdBy: accountId,
    }).save();

    return newComment.toObject();
  }
}
