import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {
  Field, ID, InputType, ObjectType, Int,
} from 'type-graphql';
import Image from 'mods/base/api/entities/Image';
import Node from 'mods/base/api/entities/Node';
import NodeConnection from 'mods/base/api/entities/NodeConnection';
import { AppDraftStatus } from './_enums';
import { AppTag } from './AppTags';
import { BannerImg } from './Apps';

@ObjectType()
export class AppDraftStatusObject {
  @Field(() => AppDraftStatus)
  key: AppDraftStatus;

  @Field()
  label: string;
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

  @Field(() => Image, { nullable: true })
  logoImg?: Image;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field(() => [BannerImg], { nullable: 'itemsAndList' })
  bannerImgs?: BannerImg[];

  @Field(() => [AppTag], { nullable: 'itemsAndList' })
  tags?: AppTag[];

  @Field(() => AppDraftStatusObject)
  status?: AppDraftStatusObject;
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

  @Field(() => [ID], { nullable: 'itemsAndList' })
  tagIds?: string[];
}

@InputType()
export class SubmitAppDraftInput {
  @Field(() => ID)
  appId: string;
}

@InputType()
export class UndoSubmitAppDraftInput {
  @Field(() => ID)
  appId: string;
}

@InputType()
export class PublishAppDraftInput {
  @Field(() => ID)
  appId: string;
}
