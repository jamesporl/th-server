import { format } from 'date-fns';
import jwt from 'jsonwebtoken';
import config from 'core/config';
import { Context } from 'core/graphql/_types';
import rolesList from './constants/rolesList';

export default function getUserByJwt(token: string): Context {
  try {
    const result = jwt.verify(
      token,
      config.JWT_SECRET,
    ) as { aid: string, uid: string; rid: string; exa: string, rnm: string };
    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    if (now > result.exa) {
      return {};
    }
    const roleDetail = rolesList.find((r) => r.shortKey === result.rnm);
    return { userId: result.uid, roleId: result.rid, role: roleDetail.key, accountId: result.aid };
  } catch (error) {
    return {};
  }
}
