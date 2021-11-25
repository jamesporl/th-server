import { RoleKey } from 'mods/base/api/entities/_enums';

export interface Context {
  roleId?: string;
  role?: RoleKey;
  userId?: string;
  accountId?: string;
}
