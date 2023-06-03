import aws from 'aws-sdk';
import config from 'core/config';

const s3Config = new aws.S3({
  endpoint: config.DO_SPACES_ENDPOINT,
  accessKeyId: config.DO_SPACES_KEY,
  secretAccessKey: config.DO_SPACES_SECRET,
});

export default s3Config;
