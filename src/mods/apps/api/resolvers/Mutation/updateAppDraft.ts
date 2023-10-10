import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import serializeEditorContentToText from '../../../../apps/utils/serializeEditorContentToText.js';
import trimEditorJsonContent from '../../../../apps/utils/trimEditorJsonContent.js';
import { MApp, MAppDraft, MAppTag } from '../../../db/index.js';
import { UpdateAppDraftInput, AppDraft } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppDraft)
  async updateAppDraft(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateAppDraftInput) input: UpdateAppDraftInput,
  ) {
    const {
      appId,
      name: iName,
      shortDesc: iShortDesc,
      jsonDesc: iJsonDesc,
      tagIds,
      videoUrl: iVideoUrl,
      websiteUrl: iWebsiteUrl,
      playStoreUrl: iPlayStoreUrl,
      appStoreUrl: iAppStoreUrl,
      socialUrls: iSocialUrls,
    } = input;

    const name = iName.trim();
    const shortDesc = iShortDesc.trim();
    const jsonDesc = trimEditorJsonContent(iJsonDesc);
    const videoUrl = iVideoUrl?.trim();
    const appStoreUrl = iAppStoreUrl?.trim();
    const playStoreUrl = iPlayStoreUrl?.trim();
    const websiteUrl = iWebsiteUrl?.trim();

    const {
      github, linkedIn, facebook, twitter, instagram,
    } = iSocialUrls || {};

    const socialUrls = {
      github: github?.trim(),
      linkedIn: linkedIn?.trim(),
      facebook: facebook?.trim(),
      twitter: twitter?.trim(),
      instagram: instagram?.trim(),
    };

    if (name.length > 40) {
      throw new UserInputError('Name should not exceed 40 characters.');
    }
    if (shortDesc.length > 80) {
      throw new UserInputError('Short description should not exceed 80 characters.');
    }

    if (jsonDesc && serializeEditorContentToText(jsonDesc).length > 10000) {
      throw new UserInputError('Description is too long.');
    }

    if (tagIds?.length > 3) {
      throw new UserInputError('Maximum of 3 tags are allowed');
    }

    const appDraft = await MAppDraft.findOne({
      appId, ownedBy: accountId, status: AppDraftStatus.inProgress,
    });
    if (!appDraft) {
      throw new UserInputError('App not found.');
    }

    const app = await MApp.findOne({ _id: appId });

    if (tagIds?.length) {
      const tagDocs = await MAppTag.find({ _id: { $in: tagIds } });
      if (tagDocs.length !== tagIds.length) {
        throw new UserInputError('Invalid tag');
      }
    }

    const updatedAppDraft = await MAppDraft.findOneAndUpdate(
      { _id: appDraft._id },
      {
        $set: {
          name,
          shortDesc,
          jsonDesc,
          tagIds,
          videoUrl,
          appStoreUrl,
          playStoreUrl,
          websiteUrl,
          socialUrls,
        },
      },
      { new: true, lean: true },
    );

    if (app.status === AppStatus.new && (app.name !== name || app.shortDesc !== shortDesc)) {
      await MApp.updateOne({ _id: appId }, { name, shortDesc });
    }

    return updatedAppDraft;
  }
}
