import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, ObjectType, InputType } from 'type-graphql';
import Node from './Node';

@ObjectType({ implements: Node })
export class Profile extends Node {
  @Field({ nullable: true })
    firstName?: string;

  @Field({ nullable: true })
    lastName?: string;

  @Field({ nullable: true })
    shortDesc?: string;

  @Field({ nullable: true })
    image?: string;

  @Field()
    email: string;

  @Field()
    isAdmin?: boolean;
}

@InputType()
export class UpdatePersonalInfoInput {
  @Field()
    firstName: string;

  @Field()
    lastName: string;

  @Field({ nullable: true })
    shortDesc?: string;
}

@InputType()
export class UpdateProfilePhotoInput {
  @Field(() => GraphQLUpload)
    file: FileUpload;
}
