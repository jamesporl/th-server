import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import slugify from 'slugify';
import serializeEditorContentToText from '../../../utils/serializeEditorContentToText.js';
import deleteLogoImgFromDOSpace from '../../../utils/deleteLogoImgsFromDOSpace.js';
import { SendGridTemplateKey } from '../../../../external/sendGrid/utils/sendGridTemplates.js';
import { MAccount } from '../../../../base/db/index.js';
import IsAdmin from '../../../../../core/graphql/IsAdmin.js';
import sendMail from '../../../../external/sendGrid/utils/sendMail.js';
import serializeEditorContentToHtml from '../../../utils/serializeEditorContentToHtml.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';
import { AppDraft, PublishAppDraftInput } from '../../entities/AppDrafts.js';
import { MApp, MAppDraft, MAppTag } from '../../../db/index.js';

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
    const isSlugTaken = await MApp.findOne({
      slug, _id: { $ne: app._id }, status: { $ne: AppStatus.deleted },
    });
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
      tagIds: appDraft.tagIds,
      socialUrls: appDraft.socialUrls,
      slug,
      status: AppStatus.published,
      publishedAt: new Date(),
    };

    await MApp.updateOne({ _id: appId }, { $set: appUpdate });

    const updatedAppDraft = await MAppDraft.findOneAndUpdate(
      { _id: appDraft._id },
      { $set: { status: AppDraftStatus.published } },
      { new: true, lean: true },
    );

    // Update Tag Computations

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

    // delete old logo if it was changed
    if (app.logoImg !== appDraft.logoImg) {
      await deleteLogoImgFromDOSpace(app.logoImg);
    }

    // TODO: delete old banner images

    const account = await MAccount.findOne({ _id: app.ownedBy });
    await sendMail({
      to: account.email,
      templateKey: SendGridTemplateKey.appPublished,
      dynamicTemplateData: {
        firstName: account.firstName,
        appName: app.name,
      },
    });

    return updatedAppDraft;
  }
}
