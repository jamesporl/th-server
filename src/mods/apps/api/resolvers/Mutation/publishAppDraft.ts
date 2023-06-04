import { UserInputError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import slugify from 'slugify';
import serializeEditorContentToHtml from 'mods/apps/utils/serializeEditorContentToHtml';
import serializeEditorContentToText from 'mods/apps/utils/serializeEditorContentToText';
import deleteLogoImgFromDOSpace from 'mods/apps/utils/deleteLogoImgsFromDOSpace';
import { MApp, MAppDraft } from '../../../db';
import { AppDraft, PublishAppDraftInput } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';
import IsAdmin from 'core/graphql/IsAdmin';
import { Context } from 'core/graphql/_types';

@Resolver()
export default class {
  @IsAdmin()
  @Mutation(() => AppDraft)
  async publishAppDraft(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => PublishAppDraftInput) input: PublishAppDraftInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId });
    const appDraft = await MAppDraft.findOne(
      { appId, ownedBy: accountId, status: AppDraftStatus.inProgress},
      { _id: 1 },
    );

    if (!app) {
      throw new UserInputError('App not found.');
    }

    const slug = slugify(appDraft.name, { lower: true, trim: true, strict: true });
    const isSlugTaken = await MApp.findOne({ slug, _id: { $ne: app._id } });
    if (isSlugTaken) {
      throw new UserInputError('App name is already taken');
    }

    const appUpdate = {
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
      slug,
      status: AppStatus.published,
      publishedAt: new Date(),
    };

    await MApp.updateOne({ _id: appId }, { $set: appUpdate });

    // delete old logo if it was changed
    if (app.logoImg !== appDraft.logoImg) {
      await deleteLogoImgFromDOSpace(app.logoImg);
    }

    const updatedAppDraft = await MAppDraft.findOneAndUpdate(
      { appId },
      { $set: { status: AppDraftStatus.published } },
      { new: true, lean: true },
    );

    return updatedAppDraft;
  }
}
