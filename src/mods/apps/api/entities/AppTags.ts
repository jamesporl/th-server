import { Field, ObjectType } from 'type-graphql';
import Node from 'mods/base/api/entities/Node';
import NodeConnection from 'mods/base/api/entities/NodeConnection';

@ObjectType({ implements: Node })
export class AppTag extends Node {
  @Field()
  name: string;
}

@ObjectType({ implements: NodeConnection })
export class AppTagConnection extends NodeConnection<AppTag> {
  @Field(() => [AppTag])
  nodes: AppTag[];
}
