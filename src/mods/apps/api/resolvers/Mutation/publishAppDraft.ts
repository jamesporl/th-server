import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import slugify from 'slugify';
import Auth from 'core/graphql/Auth';
import serializeEditorContentToHtml from 'mods/apps/utils/serializeEditorContentToHtml';
import serializeEditorContentToText from 'mods/apps/utils/serializeEditorContentToText';
import deleteLogoImgFromDOSpace from 'mods/apps/utils/deleteLogoImgsFromDOSpace';
import { MApp, MAppDraft } from '../../../db';
import { AppDraft, PublishAppDraftInput } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppDraft)
  async publishAppDraft(
    @Arg('input', () => PublishAppDraftInput) input: PublishAppDraftInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId });
    const appDraft = await MAppDraft.findOne({ appId });

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
    if (app.logoImg) {
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
