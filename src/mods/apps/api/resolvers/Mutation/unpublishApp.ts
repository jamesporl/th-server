import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import { MApp, MAppDraft, MAppTag } from '../../../db';
import { AppDraft } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';
import { UnpublishAppInput } from '../../entities/Apps';

// When unpublishing an app, create an app draft so that a copy of the app is still accessible
// to the owner of the app
@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppDraft)
  async unpublishApp(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UnpublishAppInput) input: UnpublishAppInput,
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId, ownedBy: accountId, status: AppStatus.published });

    if (!app) {
      throw new UserInputError('App not found.');
    }

    let appDraft = await MAppDraft.findOne(
      { appId, ownedBy: accountId, status: AppDraftStatus.inProgress },
    ).lean();

    if (!appDraft) {
      const newAppDraft = await new MAppDraft({
        appId: app._id,
        name: app.name,
        jsonDesc: app.jsonDesc,
        shortDesc: app.shortDesc,
        playStoreUrl: app.playStoreUrl,
        appStoreUrl: app.appStoreUrl,
        websiteUrl: app.websiteUrl,
        logoImg: app.logoImg,
        videoUrl: app.videoUrl,
        bannerImgs: app.bannerImgs,
        status: AppDraftStatus.inProgress,
        socialUrls: app.socialUrls,
        ownedBy: accountId,
        tagIds: app.tagIds,
      }).save();

      appDraft = newAppDraft.toObject();
    }

    if (app.tagIds?.length) {
      await MAppTag.updateMany({ _id: { $in: app.tagIds } }, { $inc: { appsCount: -1 } });
    }

    await MApp.updateOne(
      { _id: appId },
      { $set: { status: AppStatus.unpublished } },
    );

    return appDraft;
  }
}
