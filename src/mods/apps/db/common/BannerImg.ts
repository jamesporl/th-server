import { Schema } from 'mongoose';
import ImageSchema from 'mods/base/db/common/Image';

const BannerImgSchema = new Schema({
  order: { type: Number, required: true },
  image: { type: ImageSchema, required: true },
});

export default BannerImgSchema;
