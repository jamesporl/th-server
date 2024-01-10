import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { ToggleCommentSupportInput } from '../../entities/Comments.js';
import { MComment, MCommentSupport } from '../../../db/index.js';
import { CommentStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async toggleCommentSupport(
    @Ctx() { accountId, dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => ToggleCommentSupportInput) input: ToggleCommentSupportInput,
  ) {
    const { commentId } = input;

    const comment = await MComment.findOne({
      _id: commentId, status: CommentStatus.published,
    });
    if (!comment) {
      throw new UserInputError('Comment not found');
    }

    const supportDoc = await MCommentSupport.findOne({ commentId, accountId });
    if (supportDoc) {
      await MCommentSupport.deleteOne({ _id: supportDoc._id });
      await MComment.updateOne({ _id: commentId }, { $inc: { supportsCount: -1 } });
    } else {
      await new MCommentSupport({
        refId: comment.refId,
        type: comment.type,
        commentId,
        accountId,
      }).save();
      await MComment.updateOne({ _id: commentId }, { $inc: { supportsCount: 1 } });
    }

    dataloaders.commentSupportLoader.clear(`${commentId}_${accountId}`);

    return { isCompleted: true };
  }
}
