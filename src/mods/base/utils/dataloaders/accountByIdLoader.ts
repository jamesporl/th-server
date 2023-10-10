import DataLoader from 'dataloader';
import { MAccount } from '../../db/index.js';
import reorderDocumentsByKeys from '../../../../core/graphql/reorderDocumentsByKeys.js';

const batchGetAccountsById = async (accountIds: string[]) => {
  const docs = await MAccount.find({ _id: { $in: accountIds } });
  return reorderDocumentsByKeys(accountIds, docs);
};

const accountByIdLoader = new DataLoader(batchGetAccountsById);

export default accountByIdLoader;
