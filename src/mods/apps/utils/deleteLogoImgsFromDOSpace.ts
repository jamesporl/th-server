import s3Config from '../../../core/s3Config.js';
import config from '../../../core/config.js';

export default async function deleteLogoImgFromDOSpace(logoImg: string) {
  await s3Config.deleteObject(
    { Bucket: config.DO_SPACES_BUCKET, Key: logoImg.replace(`${config.DO_SPACES_URL}/`, '') },
  ).promise();
}
