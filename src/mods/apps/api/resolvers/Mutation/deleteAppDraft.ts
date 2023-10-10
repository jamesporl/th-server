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
import { DeleteAppDraftInput } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async deleteAppDraft(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => DeleteAppDraftInput) input: DeleteAppDraftInput,
  ) {
    const { appId } = input;
    const appDraft = await MAppDraft.findOne(
      { appId, ownedBy: accountId, status: AppDraftStatus.inProgress },
    );

    if (!appDraft) {
      throw new UserInputError('App not found.');
    }

    const app = await MApp.findOne({ _id: appId });

    if (app.status === AppStatus.new) {
      if (appDraft.logoImg) {
        await s3Config.deleteObject(
          {
            Bucket: config.DO_SPACES_BUCKET,
            Key: appDraft.logoImg.replace(`${config.DO_SPACES_URL}/`, ''),
          },
        ).promise();
      }

      if (appDraft.bannerImgs?.length) {
        await Promise.all(appDraft.bannerImgs.map(async (bannerImg) => {
          await s3Config.deleteObject(
            {
              Bucket: config.DO_SPACES_BUCKET,
              Key: bannerImg.image.large.replace(`${config.DO_SPACES_URL}/`, ''),
            },
          ).promise();

          await s3Config.deleteObject(
            {
              Bucket: config.DO_SPACES_BUCKET,
              Key: bannerImg.image.thumbnail.replace(`${config.DO_SPACES_URL}/`, ''),
            },
          ).promise();
        }));
      }
    }

    await MAppDraft.updateOne({ _id: appDraft._id }, { $set: { status: AppDraftStatus.deleted } });

    return { isCompleted: true };
  }
}
