import { Field, ObjectType } from 'type-graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import Node from 'mods/base/api/entities/Node';
import { SimpleAccount } from 'mods/base/api/entities/Account';
import { AppCommentConnection, AppCommentStatusObject } from './AppComments'; // eslint-disable-line import/no-cycle

// This should be in the same file alongside other appComment entities
// but having a recursive field, it had to be in a separate file
// See https://github.com/MichalLytek/type-graphql/issues/57
@ObjectType({ implements: Node })
export default class AppComment extends Node {
  @Field({ nullable: true })
  content: string;

  @Field(() => Boolean, { nullable: true })
  isPinned: boolean;

  @Field(() => SimpleAccount)
  createdBy: SimpleAccount;

  @Field(() => AppCommentStatusObject)
  status: AppCommentStatusObject;

  /* eslint-disable @typescript-eslint/no-use-before-define */
  @Field(() => AppCommentConnection, { nullable: true })
  comments: AppCommentConnection;

  @Field(() => GraphQLDateTime)
  createdAt: Date;
}
