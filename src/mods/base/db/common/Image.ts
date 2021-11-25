import { Schema } from 'mongoose';

const ImageSchema = new Schema({
  thumbnail: String,
  medium: String,
  large: String,
});

export default ImageSchema;
