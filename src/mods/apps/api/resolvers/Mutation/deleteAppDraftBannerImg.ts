import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import config from '../../../../../core/config.js';
import s3Config from '../../../../../core/s3Config.js';
import { MApp, MAppDraft } from '../../../db/index.js';
import { DeleteAppDraftBannerImgInput } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';

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
    if ([AppStatus.published, AppStatus.unpublished].includes(app.status)) {
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
