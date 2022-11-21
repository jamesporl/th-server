import {
  cleanEnv, str, port, num, url,
} from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const config = cleanEnv(process.env, {
  JWT_SECRET_AUTH: str({ default: 'ChaNg3MePlea$e' }),
  JWT_EXPIRATION: num({ default: 24 }),
  PORT: port({ default: 4000 }),
  MONGODB_URI: str({ default: 'mongodb://localhost:27017/th' }),
  NODE_ENV: str({ default: 'development' }),
  DO_SPACES_BUCKET: str({ default: 'techhustlers' }),
  DO_SPACES_ENDPOINT: str({ default: 'sgp1.digitaloceanspaces.com' }),
  DO_SPACES_KEY: str({ default: 'CHANGE_ME' }),
  DO_SPACES_SECRET: str({ default: 'CHANGE_ME' }),
  DO_SPACES_URL: url({ default: 'https://techhustlers.sgp1.digitaloceanspaces.com' }),
  DO_SPACES_PATH_PREFIX: str({ default: 'dev' }),
  GOOGLE_OAUTH_CLIENT_ID: str({ default: 'client_id' }),
  GOOGLE_OAUTH_CLIENT_SECRET: str({ default: 'secret' }),
  GOOGLE_OAUTH_REDIRECT_URL: url({ default: 'https://techhustlers.ph/account/oauth/google/receive' }),
  SENDGRID_API_KEY: str({ default: '' }),
  SENDGRID_FROM_EMAIL: str({ default: 'admin@techhustlers.ph' }),
  SENDGRID_FROM_NAME: str({ default: '' }),
  TH_CLIENT_BASE_URL: url({ default: 'http://localhost:3000' }),
});

export default config;
