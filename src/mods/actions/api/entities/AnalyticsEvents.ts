import { Field, InputType, ID } from 'type-graphql';
import { AnalyticsEventType } from './_enums.js';

@InputType()
/* eslint-disable import/prefer-default-export */
export class AddAnalyticsEventInput {
  @Field(() => AnalyticsEventType) type: AnalyticsEventType;

  @Field(() => ID) appId: string;
}
