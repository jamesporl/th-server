import { ForbiddenError, UserInputError } from 'apollo-server-express';
import { Arg, Resolver, Ctx, Query, ID } from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import { MApp } from '../../../db';
import { App } from '../../entities/Apps';
import { AppStatus } from '../../entities/_enums';
import { RoleKey } from 'mods/base/api/entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Query(() => App, { nullable: true })
  async app(
    @Ctx() { accountId, role }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('_id', () => ID, { nullable: true }) _id: string,
  ) {
    const app = await MApp.findOne({ _id, status: { $ne: AppStatus.deleted } }).lean();
    if (!app) {
      throw new UserInputError('App not found');
    }

    if (
      [AppStatus.new, AppStatus.waiting].includes(app.status)
      && (app.ownedBy.toHexString() !== accountId || role !== RoleKey.staff)
    ) {
      throw new ForbiddenError('Forbidden');
    }
    return app;
  }
}
