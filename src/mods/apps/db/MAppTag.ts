import { model, Schema } from 'mongoose';
import { DbAppTag } from './_types';

const AppTagSchema = new Schema(
  {
    name: {
      type: String, required: true, index: true, unique: true,
    },
    slug: {
      type: String, required: true, index: true, unique: true,
    },
    imgUrl: { type: String, required: true },
    appsCount: { type: Number, required: true, default: 0 },
  },
  {
    collection: 'AppTag',
  },
);

const MAppTag = model<DbAppTag>('AppTag', AppTagSchema);

export default MAppTag;
