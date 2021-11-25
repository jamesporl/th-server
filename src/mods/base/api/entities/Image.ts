import { Field, ObjectType } from 'type-graphql';
import Node from './Node';

@ObjectType({ implements: Node })
export default class Image extends Node {
  @Field({ nullable: true })
  medium: string;

  @Field({ nullable: true })
  large: string;

  @Field({ nullable: true })
  thumbnail: string;

  @Field({ nullable: true })
  thumbnails: string;
}
