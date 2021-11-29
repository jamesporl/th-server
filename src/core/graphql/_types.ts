import { RoleKey } from 'mods/base/api/entities/_enums';
import createDataloaders from './createDataloaders';

export interface UserContext {
  roleId?: string;
  role?: RoleKey;
  userId?: string;
  accountId?: string;
}

export interface Context extends UserContext {
  dataloaders: ReturnType<typeof createDataloaders>;
}
