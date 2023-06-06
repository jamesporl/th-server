import { Field, InterfaceType, Int } from 'type-graphql';
import Node from './Node';

@InterfaceType()
export default abstract class NodeConnection<T extends Node> {
  abstract nodes: T[];

  @Field(() => Int)
    totalCount: number;
}
