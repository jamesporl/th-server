import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { GraphQLDate } from 'graphql-iso-date';
import { Field, ID, InputType, ObjectType, Int } from 'type-graphql';
import Image from 'mods/base/api/entities/Image';
import Node from 'mods/base/api/entities/Node';
import { AppDraftStatus, AppStatus } from './_enums';
import NodeConnection from 'mods/base/api/entities/NodeConnection';

@InputType()
export class AddAppInput {
  @Field()
  name: string;

  @Field()
  shortDesc: string;
}

@ObjectType()
export class AppStatusObject {
  @Field(() => AppStatus)
  key: AppStatus;

  @Field()
  label: string;
}

@ObjectType()
export class AppDraftStatusObject {
  @Field(() => AppDraftStatus)
  key: AppDraftStatus;

  @Field()
  label: string;
}

@ObjectType()
export class BannerImg {
  @Field(() => Int)
  order: number;

  @Field(() => Image)
  image: Image;
}

@ObjectType({ implements: Node })
export class App extends Node {
  @Field()
  name: string;

  @Field()
  shortDesc: string;

  @Field({ nullable: true })
  desc?: string;

  @Field({ nullable: true })
  playStoreUrl?: string;

  @Field({ nullable: true })
  appStoreUrl?: string;
    
  @Field({ nullable: true })
  websiteUrl?: string;

  @Field(() => GraphQLDate, { nullable: true })
  publishDate?: Image;

  @Field(() => Image, { nullable: true })
  logoImg?: Image;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field(() => [BannerImg], { nullable: 'itemsAndList' })
  bannerImgs?: BannerImg[];

  @Field(() => AppStatusObject)
  status?: AppStatusObject;
}

@ObjectType({ implements: Node })
export class AppDraft extends Node {
  @Field()
  appId: string;

  @Field()
  name: string;

  @Field()
  shortDesc: string;

  @Field({ nullable: true })
  desc?: string;

  @Field({ nullable: true })
  playStoreUrl?: string;

  @Field({ nullable: true })
  appStoreUrl?: string;
    
  @Field({ nullable: true })
  websiteUrl?: string;

  @Field(() => GraphQLDate, { nullable: true })
  publishDate?: Image;

  @Field(() => Image, { nullable: true })
  logoImg?: Image;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field(() => [BannerImg], { nullable: 'itemsAndList' })
  bannerImgs?: BannerImg[];

  @Field(() => AppDraftStatusObject)
  status?: AppDraftStatusObject;
}

@ObjectType({ implements: NodeConnection })
export class AppConnection extends NodeConnection<App> {
  @Field(() => [App])
  nodes: App[];
}

@ObjectType({ implements: NodeConnection })
export class AppDraftConnection extends NodeConnection<AppDraft> {
  @Field(() => [AppDraft])
  nodes: AppDraft[];
}

@InputType()
export class UpdateAppDraftBannerImgInput {
  @Field(() => ID)
  appId: string;

  @Field(() => Int)
  order: number;

  @Field(() => GraphQLUpload)
  file: FileUpload;
}

@InputType()
export class UpdateAppDraftLogoImgInput {
  @Field(() => ID)
  appId: string;

  @Field(() => GraphQLUpload)
  file: FileUpload;
}

@InputType()
export class UpdateAppDraftInput {
  @Field(() => ID)
  appId: string;

  @Field()
  name: string;

  @Field()
  shortDesc: string;

  @Field({ nullable: true })
  desc?: string;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field({ nullable: true })
  playStoreUrl?: string;

  @Field({ nullable: true })
  appStoreUrl?: string;
    
  @Field({ nullable: true })
  websiteUrl?: string;

  @Field(() => GraphQLDate, { nullable: true })
  publishDate?: Image;
}

@InputType()
export class UpdateAppDraftStatusInput {
  @Field(() => ID)
  appId: string;

  @Field(() => AppDraftStatus)
  status: AppDraftStatus;
}
