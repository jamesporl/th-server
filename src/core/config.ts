import {cleanEnv, str, port, num, url } from 'envalid'
import dotenv from 'dotenv';

dotenv.config();

const config = cleanEnv(process.env, {
  JWT_SECRET: str({ default: 'ChaNg3MePlea$e' }),
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
});

export default config;
