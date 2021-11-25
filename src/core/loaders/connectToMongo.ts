import mongoose from 'mongoose';
import config from '../config';

export default async function connectToMongo(): Promise<void> {
  mongoose.set('debug', config.NODE_ENV === 'development');
  await mongoose.connect(config.MONGODB_URI);
}
