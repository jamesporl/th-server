import { FileUpload, GraphQLUpload } from 'graphql-upload';
import {
  Field, ObjectType, ID, InputType,
} from 'type-graphql';
import Image from './Image';
import Node from './Node';
import { RoleKey } from './_enums';

@ObjectType({ implements: Node })
export class ProfileRole extends Node {
  @Field(() => RoleKey, { nullable: true })
  key: RoleKey;

  @Field({ nullable: true })
  label: string;
}

@ObjectType({ implements: Node })
export class Profile extends Node {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  shortDesc?: string;

  @Field(() => Image, { nullable: true })
  image?: Image;

  @Field()
  email: string;

  @Field(() => ID)
  roleId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [ProfileRole], { nullable: true })
  roles?: ProfileRole[];
}

@InputType()
export class UpdatePersonalInfoInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  shortDesc?: string;
}

@InputType()
export class UpdateProfilePhotoInput {
  @Field(() => GraphQLUpload)
  file: FileUpload;
}
