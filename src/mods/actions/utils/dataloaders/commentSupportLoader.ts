/* eslint-disable no-restricted-syntax, no-await-in-loop */
import DataLoader from 'dataloader';
import { groupBy } from 'lodash';
import MCommentSupport from '../../db/MCommentSupport.js';

const batchGetCommentSupports = async (commentIdAndAccountIds: string[]) => {
  const idObjs: { commentId: string, accountId: string }[] = commentIdAndAccountIds.map((s) => {
    const split = s.split('_');
    return { commentId: split[0], accountId: split[1] };
  });
  const idObjsByAccountId = groupBy(idObjs, 'accountId');
  let docs = [];
  for (const accountId of Object.keys(idObjsByAccountId)) {
    const commentIds = idObjsByAccountId[accountId].map(
      (obj) => obj.commentId,
    );
    const docsForAccountId = await MCommentSupport.find(
      { accountId, commentId: { $in: commentIds } },
    );
    docs = [...docs, ...docsForAccountId];
  }

  return idObjs.map((s) => {
    const doc = docs.find(
      (d) => d.commentId.toHexString() === s.commentId && d.accountId.toHexString() === s.accountId,
    );
    return !!doc;
  });
};

const commentSupportsLoader = new DataLoader(batchGetCommentSupports);

export default commentSupportsLoader;
