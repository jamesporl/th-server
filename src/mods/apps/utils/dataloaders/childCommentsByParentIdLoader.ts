/* eslint-disable no-restricted-syntax, no-await-in-loop */
import DataLoader from 'dataloader';
import { MAppComment } from '../../db/index.js';

const batchGetChildCommentsByParentId = async (commentIds: string[]) => {
  const docs = await MAppComment.find(
    { parentCommentId: { $in: commentIds } },
  ).sort({ createdAt: -1 });
  return commentIds.map((cId) => {
    const childComments = docs.filter((d) => d.parentCommentId.toHexString() === cId);
    return childComments;
  });
};

const childCommentsByParentIdLoader = new DataLoader(batchGetChildCommentsByParentId);

export default childCommentsByParentIdLoader;
