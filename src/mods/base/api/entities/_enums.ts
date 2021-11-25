import 'reflect-metadata';
import { registerEnumType } from 'type-graphql';

export enum RoleKey {
  staff = 'staff',
  user = 'user',
}

registerEnumType(RoleKey, { name: 'RoleKey' });
export const ROLE_KEY_VALUES = Object.values(RoleKey);
