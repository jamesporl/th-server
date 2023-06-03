import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import deleteLogoImgFromDOSpace from 'mods/apps/utils/deleteLogoImgsFromDOSpace';
import { MApp, MAppDraft } from '../../../db';
import { DeleteAppDraftLogoImgInput } from '../../entities/AppDrafts';
import { AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async deleteAppDraftLogoImg(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => DeleteAppDraftLogoImgInput) input: DeleteAppDraftLogoImgInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId } = input;
    const appDraft = await MAppDraft.findOne({ appId, ownedBy: accountId }, { _id: 1, logoImg: 1 });

    if (!appDraft) {
      throw new UserInputError('App not found.');
    }

    if (!appDraft.logoImg) {
      throw new UserInputError('No uploaded logo found.');
    }

    await MAppDraft.updateOne({ _id: appDraft._id }, { $unset: { logoImg: 1 } });

    // if current logo is not being used in published app, delete them
    const app = await MApp.findOne({ _id: appId });
    if (app.status === AppStatus.published
      && app.logoImg
      && appDraft.logoImg !== app.logoImg
    ) {
      await deleteLogoImgFromDOSpace(appDraft.logoImg);
    }

    return { isCompleted: true };
  }
}
