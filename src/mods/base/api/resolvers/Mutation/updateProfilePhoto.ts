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
import s3Config from 'core/s3Config';
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

    const imgKey = `${config.DO_SPACES_PATH_PREFIX}/profile/${accountId}/${imgId.toHexString()}.jpg`;

    const pipeline = sharp()
      .resize(512, 512, {
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
        Key: imgKey,
        Body: piped,
        ACL: 'public-read',
        ContentDisposition: 'inline',
        ContentType: 'image/jpeg',
      })
      .promise();

    const account = await MAccount.findOne({ _id: accountId });
    if (account.image) {
      await s3Config.deleteObject(
        { Bucket: config.DO_SPACES_BUCKET, Key: account.image },
      ).promise();
    }

    await MAccount.updateOne(
      { _id: accountId },
      { $set: { image: `${config.DO_SPACES_URL}/${imgKey}` } },
    );
    return { isCompleted: true };
  }
}
