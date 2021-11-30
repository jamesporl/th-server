/* eslint-disable no-restricted-syntax, no-await-in-loop */
import DataLoader from 'dataloader';
import { groupBy } from 'lodash';
import { MAppSupport } from 'mods/apps/db';

const batchGetAppSupports = async (appIdAndAccountIds: string[]) => {
  const idObjs: { appId: string, accountId: string }[] = appIdAndAccountIds.map((s) => {
    const split = s.split('_');
    return { appId: split[0], accountId: split[1] };
  });
  const idObjsByAccountId = groupBy(idObjs, 'accountId');
  let docs = [];
  for (const accountId of Object.keys(idObjsByAccountId)) {
    const appIds = idObjsByAccountId[accountId].map(
      (obj) => obj.appId,
    );
    const docsForAccountId = await MAppSupport.find({ accountId, appId: { $in: appIds } });
    docs = [...docs, ...docsForAccountId];
  }

  return idObjs.map((s) => {
    const doc = docs.find(
      (d) => d.appId.toHexString() === s.appId && d.accountId.toHexString() === s.accountId,
    );
    return !!doc;
  });
};

const appSupportsLoader = new DataLoader(batchGetAppSupports);

export default appSupportsLoader;
