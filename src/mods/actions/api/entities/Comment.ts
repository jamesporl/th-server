import { Field, ObjectType, Int } from 'type-graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { CommentConnection, CommentStatusObject } from './Comments'; // eslint-disable-line import/no-cycle
import { SimpleAccount } from '../../../base/api/entities/Account.js';
import Node from '../../../base/api/entities/Node';

// This should be in the same file alongside other comment entities
// but having a recursive field, it had to be in a separate file
// See https://github.com/MichalLytek/type-graphql/issues/57
@ObjectType({ implements: Node })
export default class Comment extends Node {
  @Field({ nullable: true }) htmlContent?: string;

  @Field({ nullable: true }) textContent?: string;

  @Field(() => Boolean, { nullable: true }) isPinned: boolean;

  @Field(() => Boolean, { nullable: true }) isParent: boolean;

  @Field(() => SimpleAccount) createdBy: SimpleAccount;

  @Field(() => CommentStatusObject) status: CommentStatusObject;

  @Field(() => CommentConnection, { nullable: true }) comments: CommentConnection;

  @Field(() => Int) supportsCount: number;

  @Field(() => Boolean) isSupported: boolean;

  @Field(() => GraphQLDateTime) createdAt: Date;
}
