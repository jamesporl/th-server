import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {
  Field, ID, InputType, ObjectType,
} from 'type-graphql';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
import NodeConnection from '../../../base/api/entities/NodeConnection.js';
import SocialUrls from '../../../base/api/entities/SocialUrls.js';
import SocialUrlsInput from '../../../base/api/entities/SocialUrlsInput.js';
import { SimpleAccount } from '../../../base/api/entities/Account.js';
import Node from '../../../base/api/entities/Node.js';
import { AppDraftStatus } from './_enums.js';
import { AppTag } from './AppTags.js';
import { BannerImg } from './Apps.js';

@ObjectType()
export class AppDraftStatusObject {
  @Field(() => AppDraftStatus) key: AppDraftStatus;

  @Field() label: string;
}

@ObjectType({ implements: Node })
export class AppDraft extends Node {
  @Field() appId: string;

  @Field() name: string;

  @Field() shortDesc: string;

  @Field(() => GraphQLJSON, { nullable: true }) jsonDesc?: unknown;

  @Field({ nullable: true }) htmlDesc?: string;

  @Field({ nullable: true }) websiteUrl?: string;

  @Field({ nullable: true }) logoImg?: string;

  @Field({ nullable: true }) videoUrl?: string;

  @Field(() => [BannerImg], { nullable: 'itemsAndList' }) bannerImgs?: BannerImg[];

  @Field(() => [AppTag], { nullable: 'itemsAndList' }) tags?: AppTag[];

  @Field(() => AppDraftStatusObject) status?: AppDraftStatusObject;

  @Field({ nullable: true }) socialUrls?: SocialUrls;

  @Field(() => SimpleAccount, { nullable: true }) ownedBy?: SimpleAccount;

  @Field(() => GraphQLDateTime, { nullable: true }) createdAt?: Date;

  @Field(() => GraphQLDateTime, { nullable: true }) updatedAt?: Date;
}

@ObjectType({ implements: NodeConnection })
export class AppDraftConnection extends NodeConnection<AppDraft> {
  @Field(() => [AppDraft]) nodes: AppDraft[];
}

@InputType()
export class AddAppDraftBannerImgInput {
  @Field(() => ID) appId: string;

  @Field(() => GraphQLUpload) file: FileUpload;
}

@InputType()
export class UpdateAppDraftLogoImgInput {
  @Field(() => ID) appId: string;

  @Field(() => GraphQLUpload) file: FileUpload;
}

@InputType()
export class DeleteAppDraftBannerImgInput {
  @Field(() => ID) appId: string;

  @Field(() => ID) bannerImgId: string;
}

@InputType()
export class UpdateAppDraftBannerImgsOrderInput {
  @Field(() => ID) appId: string;

  @Field(() => [ID]) bannerImgIds: string[];
}

@InputType()
export class DeleteAppDraftLogoImgInput {
  @Field(() => ID) appId: string;
}

@InputType()
export class UpdateAppDraftInput {
  @Field(() => ID) appId: string;

  @Field() name: string;

  @Field() shortDesc: string;

  @Field(() => GraphQLJSON, { nullable: true }) jsonDesc?: unknown;

  @Field({ nullable: true }) videoUrl?: string;

  @Field({ nullable: true }) websiteUrl?: string;

  @Field(() => [ID], { nullable: 'itemsAndList' }) tagIds?: string[];

  @Field({ nullable: true }) socialUrls?: SocialUrlsInput;
}

@InputType()
export class SubmitAppDraftInput {
  @Field(() => ID) appId: string;
}

@ObjectType()
export class SubmitAppDraftPayload {
  @Field(() => [String]) errors: string[];

  @Field(() => Boolean) isSubmitted: boolean;
}

@InputType()
export class UndoSubmitAppDraftInput {
  @Field(() => ID) appId: string;
}

@InputType()
export class PublishAppDraftInput {
  @Field(() => ID) appId: string;
}

@InputType()
export class DeleteAppDraftInput {
  @Field(() => ID) appId: string;
}
