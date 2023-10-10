import { model, Schema } from 'mongoose';
import { DbAppSupport } from './_types.js';

const AppSupportSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, required: true, index: true },
    appId: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  { collection: 'AppSupport', timestamps: true },
);

const MAppSupport = model<DbAppSupport>('AppSupport', AppSupportSchema);

export default MAppSupport;
