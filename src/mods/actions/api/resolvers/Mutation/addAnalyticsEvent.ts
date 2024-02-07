import { Types } from 'mongoose';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { UserInputError } from 'apollo-server-express';
import { Context } from '../../../../../core/graphql/_types.js';
import redisConnection from '../../../../../core/redisConnection.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import { AddAnalyticsEventInput } from '../../entities/AnalyticsEvents.js';
import { MAnalyticsEvent } from '../../../db';
import { AnalyticsEventType } from '../../entities/_enums.js';
import { MApp } from '../../../../apps/db';
import { AppStatus } from '../../../../apps/api/entities/_enums.js';

@Resolver()
export default class {
  @Mutation(() => DefaultMutationPayload)
  async addAnalyticsEvent(
    @Ctx() { accountId, ipAddress }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => AddAnalyticsEventInput) input: AddAnalyticsEventInput,
  ) {
    const { appId, type } = input;

    if (new Types.ObjectId(appId).toHexString() !== appId) {
      throw new UserInputError('Invalid appId');
    }

    let lastEventKey = `${appId}_${type}_${ipAddress}`;
    if (accountId) {
      lastEventKey = `${appId}_${type}_${accountId}`;
    }

    const keyExists = await redisConnection.get(lastEventKey);
    if (!keyExists) {
      const app = await MApp.findOne({ _id: appId, status: AppStatus.published });
      if (!app) {
        throw new UserInputError('Invalid appId');
      }
      await new MAnalyticsEvent({
        type,
        appId,
        accountId,
        ipAddress,
      }).save();
      if (type === AnalyticsEventType.appView) {
        await MApp.updateOne({ _id: appId }, { $inc: { 'analytics.views': 1 } });
      } else if (type === AnalyticsEventType.appWebsiteClick) {
        await MApp.updateOne({ _id: appId }, { $inc: { 'analytics.websiteClicks': 1 } });
      } else if (type === AnalyticsEventType.appFacebookClick) {
        await MApp.updateOne({ _id: appId }, { $inc: { 'analytics.facebookClicks': 1 } });
      } else if (type === AnalyticsEventType.appInstagramClick) {
        await MApp.updateOne({ _id: appId }, { $inc: { 'analytics.instagramClicks': 1 } });
      } else if (type === AnalyticsEventType.appTwitterClick) {
        await MApp.updateOne({ _id: appId }, { $inc: { 'analytics.twitterClicks': 1 } });
      } else if (type === AnalyticsEventType.appLinkedInClick) {
        await MApp.updateOne({ _id: appId }, { $inc: { 'analytics.linkedInClicks': 1 } });
      } else if (type === AnalyticsEventType.appGithubClick) {
        await MApp.updateOne({ _id: appId }, { $inc: { 'analytics.githubClicks': 1 } });
      }
      redisConnection.setex(lastEventKey, 3600, 1); // 1 hour expiry
    }
    return { isCompleted: true };
  }
}
