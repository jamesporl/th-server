import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
import {
  Field, InputType, ObjectType, Int,
} from 'type-graphql';
import Image from 'mods/base/api/entities/Image';
import Node from 'mods/base/api/entities/Node';
import NodeConnection from 'mods/base/api/entities/NodeConnection';
import SocialUrls from 'mods/base/api/entities/SocialUrls';
import { SimpleAccount } from 'mods/base/api/entities/Account';
import { AppStatus } from './_enums';
import { AppTag } from './AppTags';

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

  @Field(() => GraphQLJSON, { nullable: true })
  jsonDesc?: unknown;

  @Field({ nullable: true })
  htmlDesc?: string;

  @Field({ nullable: true })
  textDesc?: string;

  @Field(() => GraphQLDateTime, { nullable: true })
  publishedAt?: Date;

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

  @Field(() => AppStatusObject)
  status?: AppStatusObject;

  @Field(() => [AppTag], { nullable: 'itemsAndList' })
  tags?: AppTag[];

  @Field(() => Int)
  supportsCount: number;

  @Field(() => Int)
  commentsCount: number;

  @Field(() => Boolean)
  isSupported: boolean;

  @Field(() => Boolean, { nullable: true })
  isFeatured?: boolean;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  socialUrls?: SocialUrls;

  @Field(() => SimpleAccount, { nullable: true })
  ownedBy?: SimpleAccount;
}

@ObjectType({ implements: NodeConnection })
export class AppConnection extends NodeConnection<App> {
  @Field(() => [App])
  nodes: App[];
}
