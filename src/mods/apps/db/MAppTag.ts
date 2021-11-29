import { model, Schema } from 'mongoose';
import { DbAppTag } from './_types';

const AppTagSchema = new Schema(
  {
    name: { type: String, required: true, index: true, unique: true },
  },
  {
    collection: 'AppTag',
  },
);

const MAppTag = model<DbAppTag>('AppTag', AppTagSchema);

export default MAppTag;
