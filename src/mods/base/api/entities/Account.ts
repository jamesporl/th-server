/* eslint-disable import/prefer-default-export */
import { Field, ObjectType } from 'type-graphql';
import Node from './Node';

@ObjectType({ implements: Node })
export class SimpleAccount extends Node {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}
