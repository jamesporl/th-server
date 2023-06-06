import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class SocialUrls {
  @Field({ nullable: true })
    facebook?: string;

  @Field({ nullable: true })
    linkedIn?: string;

  @Field({ nullable: true })
    twitter?: string;

  @Field({ nullable: true })
    instagram?: string;

  @Field({ nullable: true })
    github?: string;
}
