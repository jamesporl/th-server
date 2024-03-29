import { UserInputError } from 'apollo-server-express';
import { Types } from 'mongoose';
import sharp from 'sharp';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import config from '../../../../../core/config.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import s3Config from '../../../../../core/s3Config.js';
import deleteLogoImgFromDOSpace from '../../../utils/deleteLogoImgsFromDOSpace.js';
import { MApp, MAppDraft } from '../../../db/index.js';
import { UpdateAppDraftLogoImgInput } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => String)
  async updateAppDraftLogoImg(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateAppDraftLogoImgInput) input: UpdateAppDraftLogoImgInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { appId, file } = input;
    const appDraft = await MAppDraft.findOne(
      { appId, ownedBy: accountId, status: AppDraftStatus.inProgress },
      { _id: 1 },
    );

    if (!appDraft) {
      throw new UserInputError('App not found.');
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method,@typescript-eslint/await-thenable
    const { createReadStream } = await file;

    const stream = createReadStream();

    const imgId = new Types.ObjectId();
    const imgKey = `${config.DO_SPACES_PATH_PREFIX}/apps/${appId}/logo/${imgId.toHexString()}.jpg`;

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

    const imgUrl = `${config.DO_SPACES_URL}/${imgKey}`;

    await MAppDraft.updateOne(
      { _id: appDraft._id },
      { $set: { logoImg: imgUrl } },
    );

    // if current logo is not being used in published app, delete them
    const app = await MApp.findOne({ _id: appId });
    if (app.status === AppStatus.published
      && app.logoImg
      && appDraft.logoImg
      && appDraft.logoImg !== app.logoImg
    ) {
      await deleteLogoImgFromDOSpace(appDraft.logoImg);
    }

    return imgUrl;
  }
}
