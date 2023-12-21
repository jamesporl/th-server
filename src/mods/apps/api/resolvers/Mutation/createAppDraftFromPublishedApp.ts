import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MApp, MAppDraft } from '../../../db/index.js';
import { AppDraft } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';
import { CreateAppDraftFromPublishedAppInput } from '../../entities/Apps.js';

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
      {
        appId,
        ownedBy: accountId,
        status: { $in: [AppDraftStatus.inProgress, AppDraftStatus.submitted] },
      },
    );

    if (appDraft) {
      if (appDraft.status === AppDraftStatus.inProgress) {
        throw new UserInputError('Draft already exists.');
      } else {
        throw new UserInputError('A submitted draft pending approval already exists.');
      }
    }

    const newAppDraft = await new MAppDraft({
      appId: app._id,
      name: app.name,
      jsonDesc: app.jsonDesc,
      shortDesc: app.shortDesc,
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
