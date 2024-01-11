/* eslint-disable no-restricted-syntax, no-await-in-loop */
import DataLoader from 'dataloader';
import { groupBy } from 'lodash';
import { UpvoteType } from '../../api/entities/_enums.js';
import MUpvote from '../../db/MUpvote.js';
import { DbUpvote } from '../../db/_types.js';

// this is most effective when the same type and account id are provided, only one db query would
// be fired
const batchGetUpvotes = async (refIdAndTypeAndAccountIds: string[]) => {
  const idObjs: {
    refId: string,
    type: UpvoteType,
    accountId: string,
  }[] = refIdAndTypeAndAccountIds.map((s) => {
    const split = s.split('_');
    return { refId: split[0], type: split[1] as UpvoteType, accountId: split[2] };
  });
  const idObjsByAccountIdAndType = groupBy(idObjs, (o) => `${o.accountId}_${o.type}`);
  let docs: DbUpvote[] = [];
  for (const accountIdAndType of Object.keys(idObjsByAccountIdAndType)) {
    const refIds = idObjsByAccountIdAndType[accountIdAndType].map(
      (obj) => obj.refId,
    );
    const [accountId, type] = accountIdAndType.split('_');
    const docsForAccountId = await MUpvote.find(
      { refId: { $in: refIds }, type, accountId },
    );
    docs = [...docs, ...docsForAccountId];
  }

  return idObjs.map((s) => {
    const doc = docs.find(
      (d) => d.refId.toHexString() === s.refId
        && d.accountId.toHexString() === s.accountId
        && d.type === s.type,
    );
    return !!doc;
  });
};

const upvotesLoader = new DataLoader(batchGetUpvotes);

export default upvotesLoader;
