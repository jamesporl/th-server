import { UserInputError } from 'apollo-server-express';
import { Arg, Resolver, Query } from 'type-graphql';
import { MApp } from '../../../db/index.js';
import { App } from '../../entities/Apps.js';
import { AppStatus } from '../../entities/_enums.js';

@Resolver()
export default class {
  @Query(() => App)
  async app(
    @Arg('slug') slug: string, // eslint-disable-line @typescript-eslint/indent
  ) {
    const app = await MApp.findOne({ slug, status: AppStatus.published }).lean();
    if (!app) {
      throw new UserInputError('App not found');
    }
    return app;
  }
}
