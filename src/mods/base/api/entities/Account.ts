/* eslint-disable import/prefer-default-export */
import { Field, ObjectType } from 'type-graphql';
import Image from './Image';
import Node from './Node';
import NodeConnection from './NodeConnection';

@ObjectType({ implements: Node })
export class SimpleAccount extends Node {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => Image, { nullable: true })
  image?: Image;
}

@ObjectType({ implements: Node })
export class Account extends Node {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  email: string;

  @Field(() => Image, { nullable: true })
  image?: Image;
}

@ObjectType({ implements: NodeConnection })
export class AccountConnection extends NodeConnection<Account> {
  @Field(() => [Account])
  nodes: Account[];
}
