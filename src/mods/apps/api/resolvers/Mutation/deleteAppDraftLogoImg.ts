import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import deleteLogoImgFromDOSpace from '../../../utils/deleteLogoImgsFromDOSpace.js';
import { MApp, MAppDraft } from '../../../db/index.js';
import { DeleteAppDraftLogoImgInput } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async deleteAppDraftLogoImg(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => DeleteAppDraftLogoImgInput) input: DeleteAppDraftLogoImgInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId } = input;
    const appDraft = await MAppDraft.findOne(
      { appId, ownedBy: accountId, status: AppDraftStatus.inProgress },
      { _id: 1, logoImg: 1 },
    );

    if (!appDraft) {
      throw new UserInputError('App not found.');
    }

    if (!appDraft.logoImg) {
      throw new UserInputError('No uploaded logo found.');
    }

    await MAppDraft.updateOne({ _id: appDraft._id }, { $unset: { logoImg: 1 } });

    // if current logo is not being used in published app, delete them
    const app = await MApp.findOne({ _id: appId });
    const hasBeenPublished = [AppStatus.published, AppStatus.unpublished].includes(app.status);
    if (
      !hasBeenPublished || (
        hasBeenPublished
        && app.logoImg
        && appDraft.logoImg !== app.logoImg
      )
    ) {
      await deleteLogoImgFromDOSpace(appDraft.logoImg);
    }

    return { isCompleted: true };
  }
}
