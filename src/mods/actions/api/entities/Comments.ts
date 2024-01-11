import {
  Field, InputType, ObjectType, ID,
} from 'type-graphql';
import { GraphQLJSON } from 'graphql-scalars';
import Comment from './Comment'; // eslint-disable-line import/no-cycle
import { CommentStatus, CommentType } from './_enums';
import NodeConnection from '../../../base/api/entities/NodeConnection';

@ObjectType()
export class CommentStatusObject {
  @Field(() => CommentStatus) key: CommentStatus;

  @Field() label: string;
}

@ObjectType({ implements: NodeConnection })
export class CommentConnection extends NodeConnection<Comment> {
  @Field(() => [Comment]) nodes: Comment[];
}

@InputType()
export class AddCommentInput {
  @Field(() => ID) refId: string;

  @Field(() => CommentType) type: CommentType;

  @Field(() => GraphQLJSON) jsonContent: unknown;

  @Field(() => ID, { nullable: true }) parentCommentId?: string;
}

@InputType()
export class TogglePinCommentInput {
  @Field(() => ID) commentId: string;
}

@InputType()
export class DeleteCommentInput {
  @Field(() => ID) commentId: string;
}
