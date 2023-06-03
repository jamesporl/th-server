import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {
  Field, ID, InputType, ObjectType, Int,
} from 'type-graphql';
import Node from 'mods/base/api/entities/Node';
import NodeConnection from 'mods/base/api/entities/NodeConnection';
import SocialUrls from 'mods/base/api/entities/SocialUrls';
import SocialUrlsInput from 'mods/base/api/entities/SocialUrlsInput';
import { SimpleAccount } from 'mods/base/api/entities/Account';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
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

  @Field(() => GraphQLJSON, { nullable: true })
  jsonDesc?: unknown;

  @Field({ nullable: true })
  htmlDesc?: string;

  @Field({ nullable: true })
  playStoreUrl?: string;

  @Field({ nullable: true })
  appStoreUrl?: string;

  @Field({ nullable: true })
  websiteUrl?: string;

  @Field({ nullable: true })
  logoImg?: string;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field(() => [BannerImg], { nullable: 'itemsAndList' })
  bannerImgs?: BannerImg[];

  @Field(() => [AppTag], { nullable: 'itemsAndList' })
  tags?: AppTag[];

  @Field(() => AppDraftStatusObject)
  status?: AppDraftStatusObject;

  @Field({ nullable: true })
  socialUrls?: SocialUrls;

  @Field(() => SimpleAccount, { nullable: true })
  ownedBy?: SimpleAccount;

  @Field(() => GraphQLDateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLDateTime, { nullable: true })
  updatedAt?: Date;
}

@ObjectType({ implements: NodeConnection })
export class AppDraftConnection extends NodeConnection<AppDraft> {
  @Field(() => [AppDraft])
  nodes: AppDraft[];
}

@InputType()
export class AddAppDraftBannerImgInput {
  @Field(() => ID)
  appId: string;

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
export class DeleteAppDraftLogoImgInput {
  @Field(() => ID)
  appId: string;
}

@InputType()
export class UpdateAppDraftInput {
  @Field(() => ID)
  appId: string;

  @Field()
  name: string;

  @Field()
  shortDesc: string;

  @Field(() => GraphQLJSON, { nullable: true })
  jsonDesc?: unknown;

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

  @Field({ nullable: true })
  socialUrls?: SocialUrlsInput;
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
