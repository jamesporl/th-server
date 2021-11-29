import { Document, Types } from 'mongoose';

export default function reorderDocumentsByKeys<Doc extends { _id: Types.ObjectId }, K>(
  keys: K[],
  docs: Doc[],
  keySelector: (doc: Doc) => K = (doc) => (doc._id as Types.ObjectId).toHexString() as unknown as K,
  keyToMapKey: (key: K) => string = (key) => key.toString(),
) {
  const docsMap = new Map(docs.map((doc) => [keyToMapKey(keySelector(doc)), doc] as [string, Doc]));

  return keys.map((key) => docsMap.get(keyToMapKey(key)));
}
