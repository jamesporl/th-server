import { model, Schema } from 'mongoose';
import { DbAccount } from './_types';
import ImageSchema from './common/Image';

const AccountSchema = new Schema(
  {
    email: { type: String, trim: true, lowercase: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    image: ImageSchema,
    phone: { type: String, trim: true },
    shortDesc: { type: String, trim: true },
    userId: Schema.Types.ObjectId,
  },
  { collection: 'Account', timestamps: true },
);

const MAccount = model<DbAccount>('Account', AccountSchema);

export default MAccount;
