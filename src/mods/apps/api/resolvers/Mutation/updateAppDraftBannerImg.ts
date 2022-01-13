import { UserInputError } from 'apollo-server-express';
import aws from 'aws-sdk';
import { Types } from 'mongoose';
import sharp from 'sharp';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import config from 'core/config';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import { MApp, MAppDraft } from '../../../db';
import { UpdateAppDraftBannerImgInput } from '../../entities/AppDrafts';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async updateAppDraftBannerImg(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateAppDraftBannerImgInput) input: UpdateAppDraftBannerImgInput,
  ) {
    const { appId, order, file } = input;

    if (order > 4 || order < 0) {
      throw new UserInputError('Order should be between 0 to 4.');
    }
    const appDraft = await MAppDraft.findOne({ appId, ownedBy: accountId });
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
        key: `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/banners/${order}/${imgId.toHexString()}.jpg`,
      },
      thumbnail: {
        height: 180,
        key: `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/banners/${order}/${imgId.toHexString()}-tn.jpg`,
      },
    };

    const s3Config = new aws.S3({
      endpoint: config.DO_SPACES_ENDPOINT,
      accessKeyId: config.DO_SPACES_KEY,
      secretAccessKey: config.DO_SPACES_SECRET,
    });

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

    const imgSubDoc = {
      _id: imgId,
      order,
      image: {
        large: imgSizes.large.key,
        thumbnail: imgSizes.thumbnail.key,
      },
    };

    const draftBannerImg = appDraft.bannerImgs?.find((img) => img.order === order);
    if (draftBannerImg) {
      await MAppDraft.updateOne(
        { appId, 'bannerImgs.order': order },
        { $set: { 'bannerImgs.$': imgSubDoc } },
      );
    } else {
      await MAppDraft.updateOne({ appId }, { $push: { bannerImgs: imgSubDoc } });
    }

    const app = await MApp.findOne({ _id: appId });
    const appBannerImg = app.bannerImgs?.find((img) => img.order === order);
    if (draftBannerImg) {
      if (draftBannerImg.image.large !== appBannerImg?.image.large) {
        await s3Config.deleteObject(
          { Bucket: config.DO_SPACES_BUCKET, Key: draftBannerImg.image.large },
        ).promise();
      }
      if (draftBannerImg.image.thumbnail !== appBannerImg?.image.thumbnail) {
        await s3Config.deleteObject(
          { Bucket: config.DO_SPACES_BUCKET, Key: draftBannerImg.image.thumbnail },
        ).promise();
      }
    }

    return { isCompleted: true };
  }
}
