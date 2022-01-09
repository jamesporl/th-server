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
import { MAccount } from 'mods/base/db';
import { UpdateProfilePhotoInput } from '../../entities/Profile';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async updateProfilePhoto(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateProfilePhotoInput) input: UpdateProfilePhotoInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { file } = input;

    // eslint-disable-next-line @typescript-eslint/unbound-method,@typescript-eslint/await-thenable
    const { createReadStream } = await file;
    const stream = createReadStream();

    const imgId = new Types.ObjectId();
    const imgSizes = {
      large: {
        width: 512,
        height: 512,
        key: `${config.DO_SPACES_PATH_PREFIX}/profile/${accountId}/${imgId.toHexString()}.jpg`,
      },
      medium: {
        width: 200,
        height: 200,
        key: `${config.DO_SPACES_PATH_PREFIX}/profile/${accountId}/${imgId.toHexString()}-md.jpg`,
      },
      thumbnail: {
        width: 80,
        height: 80,
        key: `${config.DO_SPACES_PATH_PREFIX}/profile/${accountId}/${imgId.toHexString()}-tn.jpg`,
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
    const account = await MAccount.findOne({ _id: accountId });
    if (account.image) {
      await s3Config.deleteObject(
        { Bucket: config.DO_SPACES_BUCKET, Key: account.image.thumbnail },
      ).promise();
      await s3Config.deleteObject(
        { Bucket: config.DO_SPACES_BUCKET, Key: account.image.medium },
      ).promise();
      await s3Config.deleteObject(
        { Bucket: config.DO_SPACES_BUCKET, Key: account.image.large },
      ).promise();
    }

    await MAccount.updateOne({ _id: accountId }, { $set: { image: imgSubDoc } });
    return { isCompleted: true };
  }
}
