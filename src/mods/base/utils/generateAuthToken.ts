import { addDays, format } from 'date-fns';
import jwt from 'jsonwebtoken';
import config from 'core/config';
import { User } from '../db/_types';
import rolesList from './constants/rolesList';

export default function generateAuthToken(user: User, accountId: string, roleId?: string) {
  if (!user.roles?.length) {
    return '';
  }
  let activeRole = user.roles[0];
  if (roleId) {
    activeRole = user.roles.find((r) => r._id.toHexString() === roleId);
  }

  const expiresAt = format(addDays(new Date(), config.JWT_EXPIRATION), 'yyyy-MM-dd HH:mm:ss');
  const roleDetail = rolesList.find((r) => r.key === activeRole.role);
  const objToSign = {
    uid: user._id.toHexString(),
    aid: accountId,
    exa: expiresAt,
    rid: activeRole._id.toHexString(),
    rnm: roleDetail.shortKey,
  };

  return jwt.sign(objToSign, config.JWT_SECRET_AUTH);
}
