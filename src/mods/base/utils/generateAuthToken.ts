import { addDays, format } from 'date-fns';
import jwt from 'jsonwebtoken';
import config from '../../../core/config.js';
import { Account } from '../db/_types.js';

export default function generateAuthToken(account: Account) {
  const expiresAt = format(addDays(new Date(), config.JWT_EXPIRATION), 'yyyy-MM-dd HH:mm:ss');
  const objToSign = {
    aid: account._id,
    exa: expiresAt,
    isa: !!account.isAdmin,
  };

  return jwt.sign(objToSign, config.JWT_SECRET_AUTH);
}
