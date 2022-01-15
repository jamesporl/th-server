/* eslint-disable import/prefer-default-export */
import { Field, ObjectType } from 'type-graphql';
import Image from './Image';
import Node from './Node';

@ObjectType({ implements: Node })
export class SimpleAccount extends Node {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => Image, { nullable: true })
  image?: Image;
}
