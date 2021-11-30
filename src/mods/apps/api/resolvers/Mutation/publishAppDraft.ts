import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { RoleKey } from 'mods/base/api/entities/_enums';
import Auth from 'core/graphql/Auth';
import { MApp, MAppDraft } from '../../../db';
import { AppDraft, PublishAppDraftInput } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth([RoleKey.staff])
  @Mutation(() => AppDraft)
  async publishAppDraft(
    @Arg('input', () => PublishAppDraftInput) input: PublishAppDraftInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId });
    const appDraft = await MAppDraft.findOne({ appId, status: AppDraftStatus.submitted });

    if (!app || !appDraft) {
      throw new UserInputError('App not found.');
    }

    let appUpdate: { [key: string]: unknown } = {
      status: AppStatus.published,
      publishedAt: new Date(),
    };
    if (app.status === AppStatus.published) {
      appUpdate = {
        name: appDraft.name,
        shortDesc: appDraft.shortDesc,
        desc: appDraft.desc,
        bannerImgs: appDraft.bannerImgs,
        logoImg: appDraft.logoImg,
        videoUrl: appDraft.videoUrl,
        websiteUrl: appDraft.websiteUrl,
        playStoreUrl: appDraft.playStoreUrl,
        appStoreUrl: appDraft.appStoreUrl,
        tagIds: appDraft.tagIds,
        ...appUpdate,
      };
    }

    await MApp.updateOne({ _id: appId }, { $set: appUpdate });

    const updatedAppDraft = await MAppDraft.findOneAndUpdate(
      { appId },
      { $set: { status: AppDraftStatus.published } },
      { new: true, lean: true },
    );

    return updatedAppDraft;
  }
}
