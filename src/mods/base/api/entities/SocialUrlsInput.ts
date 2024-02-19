import { Field, InputType } from 'type-graphql';

@InputType()
export default class SocialUrlsInput {
  @Field({ nullable: true }) facebook?: string;

  @Field({ nullable: true }) linkedIn?: string;

  @Field({ nullable: true }) x?: string;

  @Field({ nullable: true }) instagram?: string;

  @Field({ nullable: true }) github?: string;

  @Field({ nullable: true }) threads?: string;

  @Field({ nullable: true }) tiktok?: string;
}
