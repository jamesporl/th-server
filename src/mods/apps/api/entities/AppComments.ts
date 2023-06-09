import {
  Field, InputType, ObjectType, ID,
} from 'type-graphql';
import NodeConnection from 'mods/base/api/entities/NodeConnection';
import { GraphQLJSON } from 'graphql-scalars';
import AppComment from './AppComment'; // eslint-disable-line import/no-cycle
import { AppCommentStatus } from './_enums';

@ObjectType()
export class AppCommentStatusObject {
  @Field(() => AppCommentStatus) key: AppCommentStatus;

  @Field() label: string;
}

@ObjectType({ implements: NodeConnection })
export class AppCommentConnection extends NodeConnection<AppComment> {
  @Field(() => [AppComment]) nodes: AppComment[];
}

@InputType()
export class AddCommentToAppInput {
  @Field(() => ID) appId?: string;

  @Field(() => GraphQLJSON) jsonContent: unknown;

  @Field(() => ID, { nullable: true }) parentCommentId?: string;
}

@InputType()
export class ToggleAppCommentSupportInput {
  @Field(() => ID) commentId: string;
}

@InputType()
export class TogglePinAppCommentInput {
  @Field(() => ID) commentId: string;
}

@InputType()
export class DeleteAppCommentInput {
  @Field(() => ID) commentId: string;
}
