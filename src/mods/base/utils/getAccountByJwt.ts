import { Types } from 'mongoose';
import { format } from 'date-fns';
import jwt from 'jsonwebtoken';
import config from 'core/config';
import { AccountContext } from 'core/graphql/_types';

export default function getAccountByJwt(token: string): AccountContext {
  try {
    const result = jwt.verify(
      token,
      config.JWT_SECRET_AUTH,
    ) as { aid: string, isa: boolean; exa: string };
    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    if (now > result.exa) {
      return {};
    }
    return {
      accountId: new Types.ObjectId(result.aid),
      isAdmin: result.isa,
    };
  } catch (error) {
    return {};
  }
}
