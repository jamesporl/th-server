import { Schema } from 'mongoose';

const SocialUrlsSchema = new Schema({
  x: String,
  facebook: String,
  linkedIn: String,
  github: String,
  instagram: String,
}, { _id: false });

export default SocialUrlsSchema;
