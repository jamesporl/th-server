import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import { Context } from '../../../../../core/graphql/_types.js';
import { ToggleUpvoteInput } from '../../entities/Upvotes.js';
import { CommentStatus, UpvoteType } from '../../entities/_enums.js';
import { MApp } from '../../../../apps/db/index.js';
import { AppStatus } from '../../../../apps/api/entities/_enums.js';
import { MComment, MUpvote } from '../../../db/index.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async toggleUpvote(
    @Ctx() { accountId, dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => ToggleUpvoteInput) input: ToggleUpvoteInput,
  ) {
    const { refId, type } = input;

    if (type === UpvoteType.app) {
      const app = await MApp.findOne({ _id: refId, status: AppStatus.published });
      if (!app) {
        throw new UserInputError('App not found');
      }
    } else if (type === UpvoteType.comment) {
      const comment = await MComment.findOne({ _id: refId, status: CommentStatus.published });
      if (!comment) {
        throw new UserInputError('Comment not found');
      }
    }

    const upvoteDoc = await MUpvote.findOne({ refId, type, accountId });

    if (upvoteDoc) {
      await MUpvote.deleteOne({ _id: upvoteDoc._id });
      if (type === UpvoteType.app) {
        await MApp.updateOne({ _id: refId }, { $inc: { upvotesCount: -1 } });
      } else if (type === UpvoteType.comment) {
        await MComment.updateOne({ _id: refId }, { $inc: { upvotesCount: -1 } });
      }
    } else {
      await new MUpvote({ refId, type, accountId }).save();
      if (type === UpvoteType.app) {
        await MApp.updateOne({ _id: refId }, { $inc: { upvotesCount: 1 } });
      } else if (type === UpvoteType.comment) {
        await MComment.updateOne({ _id: refId }, { $inc: { upvotesCount: 1 } });
      }
    }

    dataloaders.upvotesLoader.clear(`${refId}_${type}_${accountId}`);

    return { isCompleted: true };
  }
}
