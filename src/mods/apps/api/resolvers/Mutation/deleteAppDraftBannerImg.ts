import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import config from 'core/config';
import s3Config from 'core/s3Config';
import { MApp, MAppDraft } from '../../../db';
import { DeleteAppDraftBannerImgInput } from '../../entities/AppDrafts';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async deleteAppDraftBannerImg(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => DeleteAppDraftBannerImgInput) input: DeleteAppDraftBannerImgInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId, bannerImgId } = input;
    const appDraft = await MAppDraft.findOne(
      { appId, ownedBy: accountId, status: AppDraftStatus.inProgress },
    );

    if (!appDraft) {
      throw new UserInputError('App not found.');
    }

    const bannerImg = (appDraft.bannerImgs || []).find(
      (img) => img._id.toHexString() === bannerImgId,
    );

    if (!bannerImg) {
      throw new UserInputError('Image not found.');
    }

    await MAppDraft.updateOne(
      { _id: appDraft._id },
      { $pull: { bannerImgs: { _id: bannerImgId } } },
    );

    // if current image is not being used in published app, delete them
    const app = await MApp.findOne({ _id: appId });
    let isUsedInPublishedApp = false;
    if (app.status === AppStatus.published) {
      isUsedInPublishedApp = !!(app.bannerImgs || []).find(
        (img) => img._id.toHexString() === bannerImgId,
      );
    }
    if (!isUsedInPublishedApp) {
      await s3Config.deleteObject(
        {
          Bucket: config.DO_SPACES_BUCKET,
          Key: bannerImg.image.thumbnail.replace(`${config.DO_SPACES_URL}/`, ''),
        },
      ).promise();
      await s3Config.deleteObject(
        {
          Bucket: config.DO_SPACES_BUCKET,
          Key: bannerImg.image.large.replace(`${config.DO_SPACES_URL}/`, ''),
        },
      ).promise();
    }

    return { isCompleted: true };
  }
}
