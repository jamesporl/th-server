import { Schema } from 'mongoose';

const BannerImageUrlsSchema = new Schema({
  large: { type: String, required: true },
  thumbnail: { type: String, required: true },
}, { _id: false });

const BannerImgSchema = new Schema({
  order: { type: Number, required: true },
  image: { type: BannerImageUrlsSchema, required: true },
});

export default BannerImgSchema;
