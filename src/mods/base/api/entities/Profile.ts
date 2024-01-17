import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, ObjectType, InputType } from 'type-graphql';
import Node from './Node';
import SocialUrlsInput from './SocialUrlsInput.js';
import SocialUrls from './SocialUrls.js';

@ObjectType({ implements: Node })
export class Profile extends Node {
  @Field({ nullable: true }) firstName?: string;

  @Field({ nullable: true }) lastName?: string;

  @Field({ nullable: true }) shortDesc?: string;

  @Field({ nullable: true }) image?: string;

  @Field() email: string;

  @Field() isAdmin?: boolean;

  @Field(() => SocialUrls, { nullable: true }) socialUrls?: SocialUrls;

  @Field({ nullable: true }) websiteUrl?: string;

  @Field({ nullable: true }) location?: string;

  @Field({ nullable: true }) bio?: string;
}

@InputType()
export class UpdatePersonalInfoInput {
  @Field() firstName: string;

  @Field() lastName: string;

  @Field({ nullable: true }) shortDesc?: string;

  @Field({ nullable: true }) bio?: string;

  @Field(() => SocialUrlsInput, { nullable: true }) socialUrls?: SocialUrlsInput;

  @Field({ nullable: true }) websiteUrl?: string;

  @Field({ nullable: true }) location?: string;
}

@InputType()
export class UpdateProfilePhotoInput {
  @Field(() => GraphQLUpload) file: FileUpload;
}
