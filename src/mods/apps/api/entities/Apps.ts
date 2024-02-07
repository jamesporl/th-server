import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
import {
  Field, InputType, ObjectType, Int, ID,
} from 'type-graphql';
import Node from '../../../base/api/entities/Node';
import NodeConnection from '../../../base/api/entities/NodeConnection';
import SocialUrls from '../../../base/api/entities/SocialUrls';
import { SimpleAccount } from '../../../base/api/entities/Account';
import { AppStatus } from './_enums';
import { AppTag } from './AppTags';

@InputType()
export class AddAppInput {
  @Field() name: string;

  @Field() shortDesc: string;
}

@ObjectType()
export class AppStatusObject {
  @Field(() => AppStatus) key: AppStatus;

  @Field() label: string;
}

@ObjectType()
export class AppAnalytics {
  @Field(() => Int) views: number;

  @Field(() => Int) websiteClicks: number;

  @Field(() => Int) facebookClicks: number;

  @Field(() => Int) instagramClicks: number;

  @Field(() => Int) xClicks: number;

  @Field(() => Int) linkedInClicks: number;

  @Field(() => Int) githubClicks: number;
}

@ObjectType()
export class BannerImageUrls {
  @Field() large: string;

  @Field() thumbnail: string;
}

@ObjectType({ implements: Node })
export class BannerImg extends Node {
  @Field(() => Int) order: number;

  @Field(() => BannerImageUrls) image: BannerImageUrls;
}

@ObjectType({ implements: Node })
export class App extends Node {
  @Field() name: string;

  @Field() shortDesc: string;

  @Field(() => GraphQLJSON, { nullable: true }) jsonDesc?: unknown;

  @Field({ nullable: true }) htmlDesc?: string;

  @Field({ nullable: true }) textDesc?: string;

  @Field(() => GraphQLDateTime, { nullable: true }) publishedAt?: Date;

  @Field({ nullable: true }) websiteUrl?: string;

  @Field({ nullable: true }) logoImg?: string;

  @Field({ nullable: true }) videoUrl?: string;

  @Field(() => [BannerImg], { nullable: 'itemsAndList' }) bannerImgs?: BannerImg[];

  @Field(() => AppStatusObject) status?: AppStatusObject;

  @Field(() => [AppTag], { nullable: 'itemsAndList' }) tags?: AppTag[];

  @Field(() => Int) upvotesCount: number;

  @Field(() => Int) commentsCount: number;

  @Field(() => Boolean) isUpvoted: boolean;

  @Field(() => Boolean, { nullable: true }) isFeatured?: boolean;

  @Field({ nullable: true }) slug?: string;

  @Field({ nullable: true }) socialUrls?: SocialUrls;

  @Field(() => SimpleAccount) ownedBy: SimpleAccount;

  @Field(() => AppAnalytics) analytics: AppAnalytics;
}

@ObjectType({ implements: NodeConnection })
export class AppConnection extends NodeConnection<App> {
  @Field(() => [App]) nodes: App[];
}

@InputType()
export class UnpublishAppInput {
  @Field(() => ID) appId: string;
}

@InputType()
export class RepublishAppInput {
  @Field(() => ID) appId: string;
}

@InputType()
export class DeleteAppInput {
  @Field(() => ID) appId: string;
}

@InputType()
export class CreateAppDraftFromPublishedAppInput {
  @Field(() => ID) appId: string;
}
