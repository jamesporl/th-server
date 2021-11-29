import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { GraphQLDate } from 'graphql-iso-date';
import { Field, ID, InputType, ObjectType, Int } from 'type-graphql';
import Image from 'mods/base/api/entities/Image';
import Node from 'mods/base/api/entities/Node';
import { AppDraftStatus, AppStatus } from './_enums';
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