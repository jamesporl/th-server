import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import serializeEditorContentToHtml from 'mods/apps/utils/serializeEditorContentToHtml';
import serializeEditorContentToText from 'mods/apps/utils/serializeEditorContentToText';
import { MApp, MAppDraft } from '../../../db';
import { AppDraft, SubmitAppDraftInput } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppDraft)
  async submitAppDraft(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => SubmitAppDraftInput) input: SubmitAppDraftInput,
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId, ownedBy: accountId });
    const appDraft = await MAppDraft.findOne({
      appId,
      ownedBy: accountId,
      status: AppDraftStatus.inProgress,
    });

    if (!app || !appDraft) {
      throw new UserInputError('App not found.');
    }

    if (!appDraft.tagIds?.length) {
      throw new UserInputError('Please add at least 1 tag');
    }

    // TODO: Some more validations here, like shortDesc is required and has length < 80

    if (app.status === AppStatus.new) {
      const appUpdate: { [key: string]: unknown } = {
        name: appDraft.name,
        shortDesc: appDraft.shortDesc,
        jsonDesc: appDraft.jsonDesc,
        htmlDesc: serializeEditorContentToHtml(appDraft.jsonDesc),
        textDesc: serializeEditorContentToText(appDraft.jsonDesc),
        bannerImgs: appDraft.bannerImgs,
        logoImg: appDraft.logoImg,
        videoUrl: appDraft.videoUrl,
        websiteUrl: appDraft.websiteUrl,
        playStoreUrl: appDraft.playStoreUrl,
        appStoreUrl: appDraft.appStoreUrl,
        tagIds: appDraft.tagIds,
        socialUrls: appDraft.socialUrls,
      };
      await MApp.updateOne(
        { _id: appId },
        { $set: { ...appUpdate, status: AppStatus.waiting } },
      );
    }

    const updatedAppDraft = await MAppDraft.findOneAndUpdate(
      { appId },
      { $set: { status: AppDraftStatus.submitted, submittedAt: new Date() } },
      { new: true, lean: true },
    );

    return updatedAppDraft;
  }
}
