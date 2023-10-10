import { UserInputError } from 'apollo-server-express';
import { orderBy } from 'lodash';
import { Types } from 'mongoose';
import sharp from 'sharp';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import config from '../../../../../core/config.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import s3Config from '../../../../../core/s3Config.js';
import { MAppDraft } from '../../../db/index.js';
import { AddAppDraftBannerImgInput } from '../../entities/AppDrafts.js';
import { BannerImg } from '../../entities/Apps.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => BannerImg)
  async addAppDraftBannerImg(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => AddAppDraftBannerImgInput) input: AddAppDraftBannerImgInput,
  ) {
    const { appId, file } = input;

    const appDraft = await MAppDraft.findOne({ appId, ownedBy: accountId }).lean();

    if (!appDraft) {
      throw new UserInputError('App not found.');
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method,@typescript-eslint/await-thenable
    const { createReadStream } = await file;

    const stream = createReadStream();

    const imgId = new Types.ObjectId();
    const imgSizes = {
      large: {
        height: 1080,
        key: `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/banners/${imgId.toHexString()}.jpg`,
      },
      thumbnail: {
        height: 180,
        key: `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/banners/${imgId.toHexString()}-tn.jpg`,
      },
    };

    await Promise.all(
      Object.keys(imgSizes).map(async (size) => {
        const pipeline = sharp()
          .resize(imgSizes[size].width as number, imgSizes[size].height as number, {
            fit: 'cover',
            background: {
              r: 0,
              g: 0,
              b: 0,
              alpha: 0,
            },
          })
          .flatten({
            background: '#ffffff',
          })
          .jpeg();

        const piped = await stream.pipe(pipeline).toBuffer();

        await s3Config
          .putObject({
            Bucket: config.DO_SPACES_BUCKET,
            Key: imgSizes[size].key,
            Body: piped,
            ACL: 'public-read',
            ContentDisposition: 'inline',
            ContentType: 'image/jpeg',
          })
          .promise();
      }),
    );

    let order = 0;
    if (appDraft.bannerImgs?.length) {
      const sortedBannerImgs = orderBy(appDraft.bannerImgs, [(i) => i.order], ['desc']);
      order = sortedBannerImgs[0].order + 1;
    }

    const imgSubDoc = {
      _id: imgId,
      order,
      image: {
        large: `${config.DO_SPACES_URL}/${imgSizes.large.key}`,
        thumbnail: `${config.DO_SPACES_URL}/${imgSizes.thumbnail.key}`,
      },
    };

    if (appDraft.bannerImgs?.length) {
      await MAppDraft.updateOne(
        { appId },
        { $push: { bannerImgs: imgSubDoc } },
      );
    } else {
      await MAppDraft.updateOne({ appId }, { $set: { bannerImgs: [imgSubDoc] } });
    }

    return imgSubDoc;
  }
}
