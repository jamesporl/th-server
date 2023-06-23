import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import config from 'core/config';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import serializeEditorContentToHtml from 'mods/apps/utils/serializeEditorContentToHtml';
import serializeEditorContentToText from 'mods/apps/utils/serializeEditorContentToText';
import sendMail from 'mods/external/sendGrid/utils/sendMail';
import { MAccount } from 'mods/base/db';
import { SendGridTemplateKey } from 'mods/external/sendGrid/utils/sendGridTemplates';
import { MApp, MAppDraft } from '../../../db';
import { SubmitAppDraftInput, SubmitAppDraftPayload } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => SubmitAppDraftPayload)
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

    const errors: string[] = [];

    const {
      tagIds,
      videoUrl,
      jsonDesc,
      logoImg,
      bannerImgs,
      socialUrls,
      websiteUrl,
      playStoreUrl,
      appStoreUrl,
    } = appDraft;

    if (appStoreUrl) {
      const re = /https:\/\/apps.apple.com\/&?/;
      if (!re.test(appStoreUrl)) {
        errors.push('App Store URL is invalid.');
      }
    }
    if (playStoreUrl) {
      const re = /https:\/\/play.google.com\/&?/;
      if (!re.test(playStoreUrl)) {
        errors.push('Play Store URL is invalid.');
      }
    }

    if (websiteUrl) {
      const re = /https:\/\/?[^/]+\.[^/]+\/?/;
      if (!re.test(websiteUrl)) {
        errors.push('Website URL is invalid.');
      }
    }

    if (socialUrls) {
      const {
        instagram, github, facebook, linkedIn, twitter,
      } = socialUrls;
      if (facebook) {
        const re = /https:\/\/(?:www\.)?facebook.com\/&?/;
        if (!re.test(facebook)) {
          errors.push('Facebook URL is invalid.');
        }
      }
      if (instagram) {
        const re = /https:\/\/(?:www\.)?instagram.com\/&?/;
        if (!re.test(instagram)) {
          errors.push('Instagram URL is invalid.');
        }
      }
      if (twitter) {
        const re = /https:\/\/(?:www\.)?twitter.com\/&?/;
        if (!re.test(twitter)) {
          errors.push('Twitter URL is invalid.');
        }
      }
      if (linkedIn) {
        const re = /https:\/\/(?:www\.)?linkedin.com\/&?/;
        if (!re.test(linkedIn)) {
          errors.push('LinkedIn URL is invalid.');
        }
      }
      if (github) {
        const re = /https:\/\/(?:www\.)?github.com\/&?/;
        if (!re.test(github)) {
          errors.push('Github URL is invalid.');
        }
      }
    }

    if (!tagIds?.length) {
      errors.push('At least 1 tag is required.');
    }

    if (tagIds.length > 3) {
      errors.push('Only 3 tags are allowed.');
    }

    if (!logoImg) {
      errors.push('Logo is required.');
    }

    if (!videoUrl && !bannerImgs.length) {
      errors.push('A banner image or a Youtube explainer video is required.');
    }

    if (videoUrl) {
      const re = /https:\/\/(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)&?/;
      if (!re.test(appDraft.videoUrl)) {
        errors.push('Youtube URL is invalid.');
      }
    }

    const textDesc = serializeEditorContentToText(jsonDesc);

    if (textDesc.length > 100) {
      errors.push('Description is too short.');
    }

    if (textDesc.length > 10000) {
      errors.push('Description is too long.');
    }

    // TODO: Some more validations here, like shortDesc is required and has length < 80

    if (errors.length) {
      return {
        errors,
        isSubmitted: false,
      };
    }

    if (app.status === AppStatus.new) {
      const appUpdate: { [key: string]: unknown } = {
        name: appDraft.name,
        shortDesc: appDraft.shortDesc,
        jsonDesc: appDraft.jsonDesc,
        htmlDesc: serializeEditorContentToHtml(appDraft.jsonDesc),
        textDesc,
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

    await MAppDraft.updateOne(
      { appId },
      { $set: { status: AppDraftStatus.submitted, submittedAt: new Date() } },
      { new: true, lean: true },
    );

    const account = await MAccount.findOne({ _id: accountId });
    await sendMail({
      to: account.email,
      templateKey: SendGridTemplateKey.receivedAppSubmission,
      dynamicTemplateData: {
        firstName: account.firstName,
        appName: app.name,
      },
    });

    await sendMail({
      to: config.ADMIN_EMAIL,
      templateKey: SendGridTemplateKey.adminNewAppSubmission,
      dynamicTemplateData: {
        email: account.email,
        name: account.name,
        appName: app.name,
      },
    });

    return {
      errors,
      isSubmitted: true,
    };
  }
}
