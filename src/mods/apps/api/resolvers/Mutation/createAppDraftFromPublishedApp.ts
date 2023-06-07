import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import { MApp, MAppDraft } from '../../../db';
import { AppDraft } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';
import { CreateAppDraftFromPublishedAppInput } from '../../entities/Apps';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppDraft)
  async createAppDraftFromPublishedApp(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => CreateAppDraftFromPublishedAppInput) input: CreateAppDraftFromPublishedAppInput,
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId, ownedBy: accountId, status: AppStatus.published });

    if (!app) {
      throw new UserInputError('App not found.');
    }

    const appDraft = await MAppDraft.findOne(
      { appId, ownedBy: accountId, status: AppDraftStatus.inProgress },
    );

    if (appDraft) {
      throw new UserInputError('Draft already exists.');
    }

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

    return newAppDraft.toObject();
  }
}
