import { Types, Document } from 'mongoose';
import { RoleKey } from '../api/entities/_enums';

export interface Image extends Document {
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
}

export interface Account {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  image?: Image;
  phone?: string;
  userId: Types.ObjectId;
  username: string;
}

export type DbAccount = Account & Document;

export interface Role {
  _id: Types.ObjectId;
  role: RoleKey;
}

export interface User {
  _id: Types.ObjectId;
  email: string;
  isActive: boolean;
  name: string;
  password?: string;
  pwResetToken?: string;
  roles: Role[];
}

export type DbUser = User & Document;
