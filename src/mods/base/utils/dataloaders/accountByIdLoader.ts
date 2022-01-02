import DataLoader from 'dataloader';
import reorderDocumentsByKeys from 'core/graphql/reorderDocumentsByKeys';
import { MAccount } from 'mods/base/db';

const batchGetAccountsById = async (accountIds: string[]) => {
  const docs = await MAccount.find({ _id: { $in: accountIds } });
  return reorderDocumentsByKeys(accountIds, docs);
};

const accountByIdLoader = new DataLoader(batchGetAccountsById);

export default accountByIdLoader;
