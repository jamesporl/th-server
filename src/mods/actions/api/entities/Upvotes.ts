/* eslint-disable import/prefer-default-export */
import { Field, InputType, ID } from 'type-graphql';
import { UpvoteType } from './_enums.js';

@InputType()
export class ToggleUpvoteInput {
  @Field(() => ID) refId: string;

  @Field(() => UpvoteType) type: UpvoteType;
}
