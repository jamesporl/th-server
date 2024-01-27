import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MApp, MAppDraft } from '../../../db/index.js';
import { AppDraft, UndoSubmitAppDraftInput } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppDraft)
  async undoSubmitAppDraft(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UndoSubmitAppDraftInput) input: UndoSubmitAppDraftInput,
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId, ownedBy: accountId });
    const appDraft = await MAppDraft.findOne({
      appId,
      ownedBy: accountId,
      status: AppDraftStatus.submitted,
    });

    if (!app || !appDraft) {
      throw new UserInputError('App not found.');
    }

    if (app.status === AppStatus.waiting) {
      await MApp.updateOne(
        { _id: appId },
        { $set: { status: AppStatus.new } },
      );
    }

    const updatedAppDraft = await MAppDraft.findOneAndUpdate(
      { _id: appDraft._id },
      { $set: { status: AppDraftStatus.inProgress } },
      { new: true, lean: true },
    );

    return updatedAppDraft;
  }
}
