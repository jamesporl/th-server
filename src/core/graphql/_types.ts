import { Types } from 'mongoose';
import createDataloaders from './createDataloaders.js';

export interface AccountContext {
  isAdmin?: boolean;
  accountId?: Types.ObjectId;
}

export interface Context extends AccountContext {
  dataloaders: ReturnType<typeof createDataloaders>;
}
