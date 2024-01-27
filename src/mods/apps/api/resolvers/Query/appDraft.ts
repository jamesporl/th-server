import { ForbiddenError, UserInputError } from 'apollo-server-express';
import {
  Arg, Resolver, Ctx, Query, ID,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MApp, MAppDraft } from '../../../db/index.js';
import { AppDraft } from '../../entities/AppDrafts.js';
import { AppDraftStatus, AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Auth()
  @Query(() => AppDraft, { nullable: true })
  async appDraft(
    @Ctx() { accountId, isAdmin }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('_id', () => ID, { nullable: true }) _id: string,
  ) {
    const app = await MApp.findOne(
      { _id, status: { $ne: AppStatus.deleted } },
      { status: 1, ownedBy: 1 },
    ).lean();

    if (!app) {
      throw new UserInputError('App not found.');
    }

    if (!isAdmin && app.ownedBy.toHexString() !== accountId.toHexString()) {
      throw new ForbiddenError('Forbidden');
    }
    const appDraft = await MAppDraft.findOne({
      appId: _id, status: AppDraftStatus.inProgress,
    }).lean();

    console.log(appDraft);

    return appDraft;
  }
}
