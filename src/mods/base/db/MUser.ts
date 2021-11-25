import { model, Schema } from 'mongoose';
import { ROLE_KEY_VALUES } from '../api/entities/_enums';
import { DbUser } from './_types';

const RoleSchema = new Schema({
  role: { type: String, required: true, enum: ROLE_KEY_VALUES },
});

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    isActive: { type: Boolean, default: true },
    name: String,
    password: String,
    pwResetToken: String,
    roles: [RoleSchema],
  },
  {
    collection: 'User', timestamps: true,
  },
);

const MUser = model<DbUser>('User', UserSchema);

export default MUser;
