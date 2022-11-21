import { model, Schema } from 'mongoose';
import { ROLE_KEY_VALUES } from '../api/entities/_enums';
import { DbUser } from './_types';

const RoleSchema = new Schema({
  role: { type: String, required: true, enum: ROLE_KEY_VALUES },
});

const UserSchema = new Schema(
  {
    email: { type: String, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verificationCodeSentAt: { type: Date },
    verificationCode: { type: String },
    verificationCodeExpiry: { type: Date },
    verificationAttempts: { type: Number, default: 0 },
    password: String,
    pwResetLinkSentAt: { type: Date },
    pwResetToken: String,
    pwResetTokenExpiresAt: Date,
    roles: [RoleSchema],
  },
  {
    collection: 'User', timestamps: true,
  },
);

const MUser = model<DbUser>('User', UserSchema);

export default MUser;
