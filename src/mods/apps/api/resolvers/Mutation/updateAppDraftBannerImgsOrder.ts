import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MAppDraft } from '../../../db/index.js';
import { AppDraftStatus } from '../../entities/_enums.js';
import { UpdateAppDraftBannerImgsOrderInput } from '../../entities/AppDrafts.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async updateAppDraftBannerImgsOrder(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateAppDraftBannerImgsOrderInput)
    input: UpdateAppDraftBannerImgsOrderInput,
  ) {
    const { appId, bannerImgIds } = input;

    const appDraft = await MAppDraft.findOne({
      appId,
      ownedBy: accountId,
      status: AppDraftStatus.inProgress,
    }).lean();
    if (!appDraft) {
      throw new UserInputError('App not found');
    }

    const bannerImgs = bannerImgIds.map((imgId, index) => {
      const bannerImg = (appDraft.bannerImgs || []).find((img) => img._id.toHexString() === imgId);
      if (!bannerImg) {
        throw new UserInputError('Invalid image ID');
      }
      return {
        ...bannerImg,
        order: index,
      };
    });

    await MAppDraft.updateOne({ _id: appDraft._id }, { $set: { bannerImgs } });

    return { isCompleted: true };
  }
}
