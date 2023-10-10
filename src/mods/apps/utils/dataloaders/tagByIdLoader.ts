import DataLoader from 'dataloader';
import reorderDocumentsByKeys from '../../../../core/graphql/reorderDocumentsByKeys.js';
import { MAppTag } from '../../db/index.js';

const batchGetTagsById = async (tagIds: string[]) => {
  const docs = await MAppTag.find({ _id: { $in: tagIds } });
  return reorderDocumentsByKeys(tagIds, docs);
};

const tagByIdLoader = new DataLoader(batchGetTagsById);

export default tagByIdLoader;
