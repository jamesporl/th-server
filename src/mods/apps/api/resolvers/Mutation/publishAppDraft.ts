import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import slugify from 'slugify';
import serializeEditorContentToHtml from 'mods/apps/utils/serializeEditorContentToHtml';
import serializeEditorContentToText from 'mods/apps/utils/serializeEditorContentToText';
import deleteLogoImgFromDOSpace from 'mods/apps/utils/deleteLogoImgsFromDOSpace';
import IsAdmin from 'core/graphql/IsAdmin';
import { MApp, MAppDraft, MAppTag } from '../../../db';
import { AppDraft, PublishAppDraftInput } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @IsAdmin()
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

    let prevTagIds = [];
    if (app.status === AppStatus.published) {
      prevTagIds = (app.tagIds || []).map((tagId) => tagId.toHexString());
    }

    const currentTagIds = (appDraft.tagIds || []).map((tagId) => tagId.toHexString());

    const removedTagIds = prevTagIds.filter((tagId) => !currentTagIds.includes(tagId));
    if (removedTagIds.length) {
      await MAppTag.updateMany({ _id: { $in: removedTagIds } }, { $inc: { appsCount: -1 } });
    }

    const newTagIds = currentTagIds.filter((tagId) => !prevTagIds.includes(tagId));
    if (newTagIds.length) {
      await MAppTag.updateMany({ _id: { $in: newTagIds } }, { $inc: { appsCount: 1 } });
    }

    return updatedAppDraft;
  }
}
