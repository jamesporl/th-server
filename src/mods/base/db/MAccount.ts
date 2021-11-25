import { model, Schema } from 'mongoose';
import { DbAccount } from './_types';
import ImageSchema from './common/Image';

const AccountSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    name: String,
    image: ImageSchema,
    phone: String,
    userId: Schema.Types.ObjectId,
  },
  { collection: 'Account', timestamps: true },
);

const MAccount = model<DbAccount>('Account', AccountSchema);

export default MAccount;
