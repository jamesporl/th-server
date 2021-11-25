import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class DefaultMutationPayload {
  @Field(() => Boolean)
  isCompleted: boolean;
}
