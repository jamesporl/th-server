import { model, Schema } from 'mongoose';
import { DbAccount } from './_types.js';

const AccountSchema = new Schema(
  {
    email: { type: String, trim: true, lowercase: true },
    isAdmin: { type: Boolean, default: false },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    image: { type: String },
    phone: { type: String, trim: true },
    shortDesc: { type: String, trim: true },
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
  },
  { collection: 'Account', timestamps: true },
);

const MAccount = model<DbAccount>('Account', AccountSchema);

export default MAccount;
