/* eslint-disable import/prefer-default-export */
import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class ToggleAppSupportInput {
  @Field(() => ID)
    appId: string;
}
