import { Schema } from 'mongoose';

const SocialUrlsSchema = new Schema({
  twitter: String,
  facebook: String,
  linkedIn: String,
  github: String,
  instagram: String,
});

export default SocialUrlsSchema;
