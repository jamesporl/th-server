import {
  Resolver, Root, FieldResolver, Ctx,
} from 'type-graphql';
import { DbApp } from '../../db/_types.js';
import { App } from '../entities/Apps.js';
import { Context } from '../../../../core/graphql/_types.js';
import { UpvoteType } from '../../../actions/api/entities/_enums.js';

@Resolver(() => App)
export default class {
  @FieldResolver()
  ownedBy(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { ownedBy }: DbApp,
  ) {
    return dataloaders.accountByIdLoader.load(ownedBy.toHexString());
  }

  @FieldResolver()
  tags(
    @Ctx() { dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { tagIds }: DbApp,
  ) {
    if (tagIds?.length) {
      const tagIdStrs = tagIds.map((tagId) => tagId.toHexString());
      return dataloaders.tagByIdLoader.loadMany(tagIdStrs);
    }
    return [];
  }

  @FieldResolver()
  analytics(
    @Ctx() { accountId, isAdmin }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { ownedBy, analytics }: DbApp,
  ) {
    if ((accountId && ownedBy.toHexString() === accountId.toHexString()) || isAdmin) {
      return {
        views: analytics?.views || 0,
        websiteClicks: analytics?.websiteClicks || 0,
        facebookClicks: analytics?.facebookClicks || 0,
        instagramClicks: analytics?.instagramClicks || 0,
        linkedInClicks: analytics?.linkedInClicks || 0,
        xClicks: analytics?.xClicks || 0,
        githubClicks: analytics?.githubClicks || 0,
      };
    }
    return {
      views: 0,
      websiteClicks: 0,
      facebookClicks: 0,
      instagramClicks: 0,
      linkedInClicks: 0,
      xClicks: 0,
      githubClicks: 0,
    };
  }

  @FieldResolver()
  isUpvoted(
    @Ctx() { dataloaders, accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Root() { _id }: DbApp,
  ) {
    if (accountId) {
      return dataloaders.upvotesLoader.load(`${_id}_${UpvoteType.app}_${accountId}`);
    }
    return false;
  }
}
