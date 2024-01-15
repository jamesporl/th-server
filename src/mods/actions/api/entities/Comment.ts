import { Field, ObjectType, Int } from 'type-graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { Comments, CommentStatusObject } from './Comments'; // eslint-disable-line import/no-cycle
import { SimpleAccount } from '../../../base/api/entities/Account.js';
import Node from '../../../base/api/entities/Node';

// This should be in the same file alongside other comment entities
// but having a recursive field, it had to be in a separate file
// See https://github.com/MichalLytek/type-graphql/issues/57
@ObjectType({ implements: Node })
export default class Comment extends Node {
  @Field() refId: string;

  @Field() htmlContent: string;

  @Field({ nullable: true }) textContent?: string;

  @Field({ nullable: true }) parentCommentId?: string;

  @Field(() => Boolean, { nullable: true }) isPinned: boolean;

  @Field(() => Boolean, { nullable: true }) isParent: boolean;

  @Field(() => SimpleAccount) createdBy: SimpleAccount;

  @Field(() => CommentStatusObject) status: CommentStatusObject;

  @Field(() => Comments, { nullable: true }) comments?: Comments;

  @Field(() => Int) upvotesCount: number;

  @Field(() => Boolean) isUpvoted: boolean;

  @Field(() => GraphQLDateTime) createdAt: Date;
}
