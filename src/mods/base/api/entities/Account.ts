/* eslint-disable import/prefer-default-export */
import { Field, ObjectType } from 'type-graphql';
import Node from './Node.js';
import NodeConnection from './NodeConnection.js';

@ObjectType({ implements: Node })
export class SimpleAccount extends Node {
  @Field({ nullable: true })
    firstName?: string;

  @Field({ nullable: true })
    lastName?: string;

  @Field({ nullable: true })
    image?: string;
}

@ObjectType({ implements: Node })
export class Account extends Node {
  @Field({ nullable: true })
    firstName?: string;

  @Field({ nullable: true })
    lastName?: string;

  @Field()
    email: string;

  @Field({ nullable: true })
    image?: string;
}

@ObjectType({ implements: NodeConnection })
export class AccountConnection extends NodeConnection<Account> {
  @Field(() => [Account])
    nodes: Account[];
}
