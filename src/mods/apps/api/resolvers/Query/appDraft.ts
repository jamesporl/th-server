import { ForbiddenError, UserInputError } from 'apollo-server-express';
import {
  Arg, Resolver, Ctx, Query, ID,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import { RoleKey } from 'mods/base/api/entities/_enums';
import { MApp, MAppDraft } from '../../../db';
import { AppDraft } from '../../entities/AppDrafts';
import { AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Query(() => AppDraft, { nullable: true })
  async appDraft(
    @Ctx() { accountId, role }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('_id', () => ID, { nullable: true }) _id: string,
  ) {
    const app = await MApp.findOne(
      { _id, status: { $ne: AppStatus.deleted } },
      { status: 1, ownedBy: 1 },
    ).lean();
    if (!app) {
      throw new UserInputError('App not found.');
    }

    if (role === RoleKey.user && app.ownedBy.toHexString() !== accountId) {
      throw new ForbiddenError('Forbidden');
    }
    const appDraft = await MAppDraft.findOne({ appId: _id }).lean();
    return appDraft;
  }
}
