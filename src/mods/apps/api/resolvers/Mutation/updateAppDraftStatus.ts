import { UserInputError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import { MApp, MAppDraft } from '../../../db';
import { UpdateAppDraftStatusInput, App } from '../../entities/Apps';
import { Context } from 'core/graphql/_types';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload)
  async updateAppDraftStatus(
    @Ctx() { accountId }: Context,  // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateAppDraftStatusInput) input: UpdateAppDraftStatusInput,
  ) {
    const { appId, status } = input;
    
    const app = await MApp.findOne({ _id: appId, ownedBy: accountId });
    const appDraft = await MAppDraft.findOne({
        appId,
        ownedBy: accountId,
        status: { $nin: [AppDraftStatus.deleted, AppDraftStatus.published] },
    });

    if (!app || !appDraft) {
      throw new UserInputError('App not found.');
    }

    if (status === AppDraftStatus.submitted) {
      const appUpdate: { [key: string]: unknown } = {
        name: appDraft.name,
        shortDesc: appDraft.shortDesc,
        publishDate: appDraft.publishDate,
        desc: appDraft.publishDate,
        bannerImgs: appDraft.bannerImgs,
        logoImg: appDraft.logoImg,
        videoUrl: appDraft.videoUrl,
        websiteUrl: appDraft.websiteUrl,
        playStoreUrl: appDraft.playStoreUrl,
        appStoreUrl: appDraft.appStoreUrl,
      };
      if (app.status === AppStatus.new) {
        await MApp.updateOne(
          { _id: appId },
          { $set: { ...appUpdate, status: AppStatus.waiting } },
        )
      }
    }

    await MAppDraft.updateOne({ appId }, { $set: { status } });

    return { isCompleted: true };
  }
}
