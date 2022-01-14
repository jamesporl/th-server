import { model, Schema } from 'mongoose';
import { DbOAuthToken } from './_types';
import { OAUTH_TOKEN_TYPES, OAUTH_WEBSITE_KEYS } from '../api/entities/_enums';

const OAuthTokenSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    tokenType: { type: String, required: true, enum: OAUTH_TOKEN_TYPES },
    websiteKey: { type: String, required: true, enum: OAUTH_WEBSITE_KEYS },
  },
  { collection: 'OAuthToken', timestamps: true },
);

const MOAuthToken = model<DbOAuthToken>('OAuthToken', OAuthTokenSchema);

export default MOAuthToken;
