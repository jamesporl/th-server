import DataLoader from 'dataloader';
import reorderDocumentsByKeys from 'core/graphql/reorderDocumentsByKeys';
import { MAppTag } from 'mods/apps/db';

const batchGetAccountsById = async (tagIds: string[]) => {
  const docs = await MAppTag.find({ _id: { $in: tagIds } });
  return reorderDocumentsByKeys(tagIds, docs);
};

const accountByIdLoader = new DataLoader(batchGetAccountsById);

export default accountByIdLoader;
