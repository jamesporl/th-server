import { Types } from 'mongoose';
import createDataloaders from './createDataloaders';

export interface AccountContext {
  isAdmin?: boolean;
  accountId?: Types.ObjectId;
}

export interface Context extends AccountContext {
  dataloaders: ReturnType<typeof createDataloaders>;
}
