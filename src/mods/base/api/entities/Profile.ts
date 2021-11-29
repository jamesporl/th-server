import { Field, ObjectType, ID } from 'type-graphql';
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
export default class Profile extends Node {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  email: string;

  @Field(() => ID)
  roleId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [ProfileRole], { nullable: true })
  roles?: ProfileRole[];
}
