import { model, Schema } from 'mongoose';
import { OAUTH_WEBSITE_KEYS } from '../api/entities/_enums';
import { DbOAuthState } from './_types';

const OAuthStateSchema = new Schema(
  {
    value: { type: String, required: true },
    websiteKey: { type: String, required: true, enum: OAUTH_WEBSITE_KEYS },
  },
  { collection: 'OAuthState', timestamps: true },
);

const MOAuthState = model<DbOAuthState>('OAuthState', OAuthStateSchema);

export default MOAuthState;
