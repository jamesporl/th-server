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
import { MAppDraft } from '../../../db';
import { UpdateAppDraftLogoImgInput } from '../../entities/AppDrafts';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async updateAppDraftLogoImg(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateAppDraftLogoImgInput) input: UpdateAppDraftLogoImgInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId, file } = input;
    const appDraft = await MAppDraft.findOne({ appId, ownedBy: accountId }, { _id: 1 });

    if (!appDraft) {
      throw new UserInputError('App not found.');
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method,@typescript-eslint/await-thenable
    const { createReadStream } = await file;

    const stream = createReadStream();

    const imgId = new Types.ObjectId();
    const imgSizes = {
      large: {
        width: 512,
        height: 512,
        key: `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/logo/${imgId.toHexString()}.jpg`,
      },
      medium: {
        width: 200,
        height: 200,
        key: `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/logo/${imgId.toHexString()}-md.jpg`,
      },
      thumbnail: {
        width: 80,
        height: 80,
        key: `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/logo/${imgId.toHexString()}-tn.jpg`,
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
      large: imgSizes.large.key,
      medium: imgSizes.medium.key,
      thumbnail: imgSizes.thumbnail.key,
    };
    await MAppDraft.updateOne({ appId }, { $set: { logoImg: imgSubDoc } });
    return { isCompleted: true };
  }
}
