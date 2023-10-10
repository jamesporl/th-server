import {
  Field, ObjectType, Int, InputType,
} from 'type-graphql';
import Node from '../../../base/api/entities/Node';
import NodeConnection from '../../../base/api/entities/NodeConnection';

@ObjectType({ implements: Node })
export class AppTag extends Node {
  @Field()
    name: string;

  @Field()
    slug: string;

  @Field()
    imgUrl: string;

  @Field(() => Int)
    appsCount: number;
}

@ObjectType({ implements: NodeConnection })
export class AppTagConnection extends NodeConnection<AppTag> {
  @Field(() => [AppTag])
    nodes: AppTag[];
}

@InputType()
export class AddAppTagInput {
  @Field()
    name: string;
}
